import asyncHandler from "express-async-handler";

import nodemailer from "nodemailer";

import {transporter} from './authController.js';

//emailsending

const sendEmail = asyncHandler(async (name, email,link) => {
   
    try {
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "For the doctor meet",
        html: `<p>Hi ${name}, click <a href="${link}">here</a> to get redirected for the meet</p>`,
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

  export const emailsender = asyncHandler(async(req,res)=>{
    const {email,name,link} = req.body;

    console.log(req.body);

    if(!email && !name){
        return res.status(400).json({success:false,message:'Bad request'});
    }

    sendEmail(name,email,link);

    res.status(200)
    .json({
        success:true,
        message:'Email sended successfully'
    })
  });