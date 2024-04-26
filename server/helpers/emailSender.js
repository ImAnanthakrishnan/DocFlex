import {transporter} from '../controller/authController.js';
import asyncHandler from 'express-async-handler'

export const sendEmail = asyncHandler(async (name, email,time) => {
    try {
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Mail from docflex appointment",
        html: `<p>Hi ${name}, your time for online meet is scheduled at <h3> ${time} </h3></p>`,
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