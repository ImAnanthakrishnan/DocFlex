import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
import Booking from "../models/bookingModel.js";
import Stripe from "stripe";
import asyncHandler from "express-async-handler";
import { transporter } from "./authController.js";


let booking,savedBookings;

export const sendEmailBookingDetails = asyncHandler(async (name, email,bookingNumber,date) => {
  try {
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Appointment Details",
      html: `<p>Hi ${name},  your appointment booked on ${date} and the booking number is <h2>${bookingNumber}</h2></p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent : ", info.response);
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//find the date of appointment
export function getNextDayDate(day) {
  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayIndex = daysOfWeek.indexOf(day.toLowerCase());
  if (dayIndex === -1) {
    throw new Error("Invalid day provided.");
  }

  const currentDate = new Date();
  const currentDayOfWeek = currentDate.getDay();
  const diff = dayIndex - currentDayOfWeek;
  
  // If the target day is in the future within the current week
  if (diff >= 0) {
    currentDate.setDate(currentDate.getDate() + diff);
  } else {
    // If the target day is in the past within the current week
    currentDate.setDate(currentDate.getDate() + diff + 7);
  }

  const year = currentDate.getFullYear();
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Adding 1 because January is month 0
  const dayOfMonth = ("0" + currentDate.getDate()).slice(-2);

  return `${year}-${month}-${dayOfMonth}`;
}


export const getCheckoutSession = asyncHandler(async (req, res) => {
  try {
    const { appointmentDate, modeOfAppointment } = req.body;

   

    let date = getNextDayDate(appointmentDate.day);


    const day = appointmentDate.day;
    const startingTime = appointmentDate.startingTime;
    const endingTime = appointmentDate.endingTime;

  
    //get currently booked doctor
    const doctor = await Doctor.findById(req.params.doctorId);
    const user = await User.findById(req.userId);

    let bookings = await Booking.find({
      doctor: doctor.id,
    });

    let perDayPatient = parseInt(appointmentDate.patientPerDay);

   console.log('perD-',perDayPatient)
    let currentDay = bookings.filter(ele => ele.appointmentDate.date === date);
console.log('curr-',currentDay.length);
    let bookingNumber = Math.abs( Math.abs(perDayPatient - currentDay.length) - (perDayPatient + 1) );
        console.log('bonum-',bookingNumber);
    if(bookingNumber === perDayPatient){
      return res.status(400).json({success:false,message: `Coming ${appointmentDate.day} are filled, please wait for next ${appointmentDate.day} or select another provided day`})
    }


    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    //create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_SITE_URL}/find-doctors/${doctor._id}`,
      //customer:user.name,
      customer_email: user.email,
      client_reference_id: req.params.doctorId,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU", "IN"],
      },
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: (Number(doctor.ticketPrice) + Number(doctor.extraCharges)) * 100,
            product_data: {
              name: doctor.name,
              description: doctor.bio,
              images: [doctor.photo],
            },
          },
          quantity: 1,
        },
      ],
    });

    //create new booking
     booking = new Booking({
      doctor: doctor._id,
      user: user._id,
      ticketPrice: doctor.ticketPrice,
      status: "approved",
      session: session.id,
      appointmentDate: {
        day,
        startingTime,
        endingTime,
        date,
      },
      modeOfAppointment,
    });

    //let savedBookings = await booking.save();


    if (savedBookings) {


      sendEmailBookingDetails(user.name,user.email,bookingNumber,date);

      res
      .status(200)
      .json({ success: true, message: "Successfully paid", session , bookingNumber , day });

    }


  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Error creating checkout session" });
  }
});


export const webhookStripe = asyncHandler(async(req,res) => {

  const sigHeader = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_SECRET_KEY;

  let event;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sigHeader, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return res.status(400).send('Webhook Error: Invalid signature.');
  }
  //webhook event
  if (event.type === 'payment_intent.succeeded') {

   savedBookings = await booking.save();
  }

});


export const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.query;

  
  if (!bookingId) {
    return res.status(400).json({ success: false, message: "Bad request" });
  }

  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,{$set:{status:"cancelled"}},
    { new: true }
  );

  console.log('cancelled-',updatedBooking);

  if (!updatedBooking) {
    return res
      .status(400)
      .json({ success: false, message: "Didn t get cancelled" });
  }

  res.status(200).json({ success: true, message: "Booking got cancelled" });
});
