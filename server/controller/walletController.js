import asyncHandler from "express-async-handler";
import Wallet from "../models/walletModel.js";
import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";

import {getNextDayDate,sendEmailBookingDetails} from './bookingController.js'

export const walletCredit = asyncHandler(async (req, res) => {
  const { userId, cash,doctorId } = req.body;

  let wallet = null;

  if (!userId || !cash || !doctorId) {
    return res.status(400).json({ success: false, message: "Bad request" });
  }

  const doctor = await Doctor.findById(doctorId);

  wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    wallet = new Wallet({
      userId,
      totalCash: cash ,
    });
    await wallet.save();
  } else {
    let sumOfCash = parseInt(cash) + doctor.extraCharges;
   wallet.totalCash += sumOfCash;
   await wallet.save();
  }

  res.status(200).json({
    success:true,
    data:wallet
  });

});

export const walletDebit = asyncHandler(async(req,res)=>{
  const { userId,doctorId, cash,appointmentDate,modeOfAppointment } = req.body;
  console.log(req.body);
  let wallet = null;

  if (!userId && !cash) {
    return res.status(400).json({ success: false, message: "Bad request" });
  }

  wallet = await Wallet.findOne({ userId: userId });

  if(!wallet){
    return res.status(404).json({success:false,message:"Wallet Not Found"});
  }

  const doctor = await Doctor.findById(doctorId);

  if(Number(cash) + Number(doctor.extraCharges) > Number(wallet.totalCash)){
    return res.status(400).json({success:false,message:'Insufficient balance'});
  }

  let date = getNextDayDate(appointmentDate.day);
  
  const day = appointmentDate.day;
  const startingTime = appointmentDate.startingTime;
  const endingTime = appointmentDate.endingTime;

 
  const user = await User.findById(userId);

  let bookings = await Booking.find({
    doctor: doctor.id,
  });

  let perDayPatient = parseInt(appointmentDate.patientPerDay);


  let currentDay = bookings.filter(ele => ele.appointmentDate.date === date);

  let bookingNumber = Math.abs((perDayPatient + 1) - Math.abs(perDayPatient - currentDay.length));

  if(bookingNumber === perDayPatient){
    return res.status(400).json({success:false,message: `Coming ${appointmentDate.day} are filled, please wait for next ${appointmentDate.day} or select another provided day`})
  }

  let totalCash = Number(wallet.totalCash) - (Number(cash) + Number(doctor.extraCharges));
 let updatedWallet = await Wallet.findOneAndUpdate({userId},{$set:{totalCash}},{new:true});

  if(!updatedWallet){
    return res.status(400).json({success:false,message:"Cash not deducted"});
  }

      //create new booking
      const booking = new Booking({
        doctor: doctor._id,
        user: user._id,
        ticketPrice: (Number(doctor.ticketPrice) + Number(doctor.extraCharges)),
        status: "approved",
        appointmentDate: {
          day,
          startingTime,
          endingTime,
          date,
        },
        modeOfAppointment,
      });
  
      let savedBookings = await booking.save();
  
if(savedBookings){
  sendEmailBookingDetails(user.name,user.email,bookingNumber,date);
}

  res.status(200).json({success:true,data:updatedWallet});

})
