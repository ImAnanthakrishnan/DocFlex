import User from '../models/userModel.js';
import Doctor from '../models/doctorModel.js'
import Booking from '../models/bookingModel.js'
import Stripe from 'stripe';
import asyncHandler from 'express-async-handler';

export const getCheckoutSession = asyncHandler(async(req,res) => {
    
    try{
        const {appointmentDate,modeOfAppointment} = req.body;
     
        //get currently booked doctor
        const doctor = await Doctor.findById(req.params.doctorId);
        const user = await User.findById(req.userId);

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        
        //create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:'payment',
            success_url:`${process.env.CLIENT_SITE_URL}/checkout-success`,
            cancel_url:`${process.env.CLIENT_SITE_URL}/find-doctors/${doctor._id}`,
            //customer:user.name,
            customer_email:user.email,
            client_reference_id:req.params.doctorId,
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA', 'GB', 'AU' , 'IN'], 
              },
            line_items:[
                {
                    price_data:{
                        currency:'usd',
                        unit_amount:doctor.ticketPrice * 100,
                        product_data:{
                            name:doctor.name,
                            description:doctor.bio,
                            images:[doctor.photo],
                        }
                    },
                    quantity:1
                }
            ]
        });
  
        //create new booking
        const booking = new Booking({
            doctor:doctor._id,
            user:user._id,
            ticketPrice:doctor.ticketPrice,
            session:session.id,
            appointmentDate,
            modeOfAppointment
        });

        await booking.save();

        res.status(200).json({success:true,message:'Successfully paid',session});
    }
    catch(err){
        res.status(500)
        .json({success:false,message:'Error creating checkout session'});
    }
});