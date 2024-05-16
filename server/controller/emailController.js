import asyncHandler from 'express-async-handler';
import { sendEmail } from '../helpers/emailSender.js';

export const TimeSchedule = asyncHandler(async(req,res)=>{
    const {timeChange,email,name} = req.body;
console.log(timeChange)
   let emailSent =  sendEmail(name,email,timeChange);
   if(emailSent){
    res.status(200).json({message:'time rescheduled',success:true});
   }else{
    res.status(400).json({message:'try again'});
   }
});