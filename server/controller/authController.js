//packages
import asyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import twilio from "twilio";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import randomstring from "randomstring";

//models
import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
import Otp from "../models/otpModel.js";

import { otpVerification } from "../helpers/otpValidate.js";
dotenv.config();

//generate token
const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1hr",
  });
};

//nodemailer
export let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

//testing nodemailer
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for verification");
    console.log(success);
  }
});

const accountSid = process.env.TWILIO_ACCOUNT_SID;

const authToken = process.env.TWILIO_AUTH_TOKEN;


//const twilioClient = new twilio(accountSid, authToken);

export const register = asyncHandler(async (req, res) => {
  const { formData, selectedFile } = req.body;
  const { email, password, phone, countryCode, gender, name } = formData;
  console.log(email);
  const concatenatedNumber = countryCode + phone;
  console.log(concatenatedNumber);
  let user = null,
    doctor = null;

  if (req.body.doctor) doctor = await Doctor.findOne({ email });
  else
    user = await User.findOne({
      $or: [{ email }, { phone: concatenatedNumber }],
    });

  //check user exist
  if (user && user.is_verified == true) {
    return res
      .status(400)
      .json({ success: false, message: "User already exist" });
  }

  if(user && user.is_verified == false){
    return res
    .status(400)
    .json({ success: false, message: "Please verify your email" });
  }

  if (doctor && doctor.is_verified == true) {
    return res
      .status(400)
      .json({ success: false, message: "Doctor already exist" });
  }

  if(doctor && doctor.is_verified == false){
    return res
    .status(400)
    .json({ success: false, message: "Please verify your email" });
  }

  //hash password
  const salt = await bcryptjs.genSalt(10);
  const hashPassword = await bcryptjs.hash(password, salt);
  if (req.body.doctor) {
    doctor = new Doctor({
      name,
      email,
      password: hashPassword,
      photo: selectedFile,
      gender,
    });
    const newDoctor = await doctor.save();
    message(res, newDoctor);
  } else {
    user = new User({
      name,
      email,
      password: hashPassword,
      phone: concatenatedNumber,
      photo: selectedFile,
      gender,
    });
    const newUser = await user.save();
    console.log(newUser);
    message(res, newUser);
  }
});

function message(res, data) {
  if (data) {
    res.status(200).json({ success: true, message: "Successfully created" });
  } else {
    res
      .status(500)
      .json({ success: false, message: "Internal server error, Try again" });
  }
}

const sendEmail = asyncHandler(async (otp,email) => {
  try {
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject:"Verify Your Email",
      html : `<p>Enter ${otp} in the app to verify your email address and complete sign in</p>`
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

export const sendOtp = asyncHandler(async (req, res) => {
  try {
    const { phone, countryCode ,email} = req.body;
   
    const concatenatedNumber = countryCode + phone;
    console.log(concatenatedNumber);
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const cDate = new Date();

    await Otp.findOneAndUpdate(
      { phoneNumber: concatenatedNumber },
      { otp, expiration: cDate.getTime() },
      { upsert: true, new: true, seDefaultsOnInsert: true }
    );
    /*await twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      to: concatenatedNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
    });*/
    
   await sendEmail(otp,email)

    return res.status(200).json({
      success: true,
      message: "OTP sent Successfully in the mail ",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export const verifyOtp = asyncHandler(async (req, res) => {
  try {
    const { otp, phone,email } = req.body;

    const otpData = await Otp.findOne({
      phoneNumber: phone,
      otp,
    });

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "You entered wrong OTP",
      });
    }

    const isOtpExpired = await otpVerification(otpData.expiration);

    if (isOtpExpired) {
      return res.status(400).json({
        success: false,
        message: "You OTP has been expired",
      });
    }

    await User.findOneAndUpdate({ phone }, { $set: { is_verified: true } });

    return res.status(200).json({
      success: true,
      message: "OTP verified Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export const userLogin = asyncHandler(async (req, res) => {
  const { email } = req.body;

  let user = null;
  try {
    const patient = await User.findOne({
      email,
      is_verified: true,
      is_admin: 0,
    });

    if (patient) {
      user = patient;
    }

    //check if user exist or not
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    //compare password
    const isPasswordMatch = await bcryptjs.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid credentials" });
    }

    //get token

    const token = generateToken(user);

    const { password, updatedAt, __v, createdAt, ...rest } = user._doc;
    res.status(200).json({
      status: true,
      message: "Successfully login",
      data: {
        ...rest,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to login" });
  }
});

export const doctorLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const validDoctor = await Doctor.findOne({ email });

  if (!validDoctor) {
    return res.status(404).json({ status: false, message: "User not found" });
  }

  if (validDoctor && bcryptjs.compareSync(password, validDoctor.password)) {
    const { password, is_blocked, updatedAt, __v, createdAt, ...rest } =
      validDoctor._doc;
    const token = generateToken(validDoctor); //jwt.sign({id:validDoctor._id},process.env.JWT_SECRET_KEY);
    // const expiryDate = new Date(Date.now() + 3600000);
    console.log({ ...rest });
    res.status(200).json({
      status: true,
      message: "Successfully login",
      token,
      data: {
        ...rest,
      },
    });
  } else {
    res.status(400).json({ status: false, message: "Invalid credentials" });
  }
});

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const validAdmin = await User.findOne({ is_admin: 1, email });

  if (!validAdmin) {
    return res.status(404).json({ status: false, message: "User not found" });
  }

  if (validAdmin && bcryptjs.compareSync(password, validAdmin.password)) {
    const { password, updatedAt, __v, createdAt, ...rest } = validAdmin._doc;
    const token = generateToken(validAdmin);

    res.status(200).json({
      status: true,
      message: "Successfully login",
      token,
      data: { ...rest },
    });
  } else {
    res.status(400).json({ status: false, message: "Invalid credentials" });
  }
});

export const googleAuthUser = asyncHandler(async (req, res) => {
  const { email, type } = req.query;

  let user = null;
  try {
    if (!email) {
      return res.json(400).json({ success: false, message: "Bad request" });
    }

    if (type === "patient") {
      user = await User.findOne({ email });
    } else if (type === "doctor") {
      user = await Doctor.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    const token = generateToken(user);

    const { password, updatedAt, __v, createdAt, ...rest } = user._doc;
    return res.status(200).json({ success: true, data: { ...rest }, token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to login" });
  }
});

//forgot password
const sendResetPassword = asyncHandler(async (name, email, token , user) => {
  try {
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "For reset Password",
      html: `<p>Hi ${name}, click <a href="${process.env.CLIENT_SITE_URL}/reset?token=${token}&user=${user}">here</a> to reset your password</p>`,
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

export const forgotVerify = asyncHandler(async (req, res) => {
  const { email, user } = req.body;

  let userData = null;

  const randomString = randomstring.generate();

  if (user === "patient") {
    userData = await User.findOne(email);
    if (userData) {
      if (!userData.is_verified) {
        return res
          .status(401)
          .json({ success: false, message: "Not a verified email" });
      }

      const s = await User.updateOne(email, { $set: { token: randomString } });
      console.log(s);

    } else {
      return res
        .status(401)
        .json({ success: false, message: "Email is not valid" });
    }
  }else if(user === 'doctor'){
    
    userData = await Doctor.findOne(email);
   
    if (userData) {
      if (userData. isApproved === 'pending' || userData. isApproved  === 'cancelled') {
        return res
          .status(401)
          .json({ success: false, message: "Not a approved user" });
      }

      const s = await Doctor.updateOne(email, { $set: { token: randomString } });
      console.log(s);
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Email is not valid" });
    }
  }

  sendResetPassword(userData.name, userData.email, randomString , user);
  res
    .status(200)
    .json({
      success: true,
      message: "Please check your mail to reset password",
      id: userData._id,
    });

});

export const resetPassword = asyncHandler(async (req, res) => {
  try {
    const password = req.body.data.password;
    const confirmPassword = req.body.data.confirmPassword;

    let updatedData = null;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Check confirm password" });
    }

    console.log(password);
    const { id, token,userRole } = req.body;
    const parsedId = JSON.parse(id);
    console.log(token);

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);


    if(userRole === 'patient'){
      let user = await User.findOne({ token });

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "unauthorized user" });
      }

       updatedData = await User.findByIdAndUpdate(
        parsedId,
        { $set: { password: hashPassword, token: "" } },
        { new: true }
      );
  
    }else if(userRole === 'doctor'){
      let user = await Doctor.findOne({ token });

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "unauthorized user" });
      }

       updatedData = await Doctor.findByIdAndUpdate(
        parsedId,
        { $set: { password: hashPassword, token: "" } },
        { new: true }
      );
    }



    if (updatedData) {
      res.status(200).json({ success: true, message: "Password changed" });
    } else {
      res
        .status(400)
        .json({
          success: false,
          message: "Password not changed,please try again",
        });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error, try again" });
  }
});

export const blockedUser = asyncHandler(async(req,res) => {
  const {user,userId} = req.params;

  let blocked = null

  if(user === 'patient'){
    blocked = await User.findOne({_id:userId});
  }

  if(user === 'doctor'){
    blocked = await Doctor.findOne({_id:userId});
  }

  if(!blocked){
    return res.status(404).json({success:false,message:'User not found'});
  }

  const {is_blocked} = blocked._doc;

  res.status(200).json({success:true,message:'success',is_blocked});
});