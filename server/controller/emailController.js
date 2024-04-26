import asyncHandler from 'express-async-handler';
import { sendEmail } from '../helpers/emailSender.js';

export const TimeSchedule = asyncHandler(async(req,res)=>{
    const {timeChange,email,name} = req.body;

    sendEmail(name,email,timeChange);
});