//packages
import express from "express";

//middlewares
import { authenticate } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/imageUpload.js";

//controllers
import {
  doctorLogin,
  register,
  userLogin,
  adminLogin,
  sendOtp,
  verifyOtp,
  googleAuthUser,
  forgotVerify,
  resetPassword,
  blockedUser,
} from "../controller/authController.js";

import { OAuth2Client } from "google-auth-library";
import { checkBlockedDoctor, checkBlockedPatient } from "../middleware/block_ublock.js";

const router = express.Router();

router.post("/register", register);

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/login", checkBlockedPatient , userLogin);

router.post("/doctor-login", checkBlockedDoctor , doctorLogin);

router.post("/admin-login", adminLogin);

router.post('/',async function (req, res, next) {

 const user = req.query.user;
    
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Referrer-Policy", "no-referrer-when-downgrade");
  
    let redirectUrl = null

    if(user === 'doctor'){
      redirectUrl = `http://localhost:8000/auth/google1`
    }else{
       redirectUrl = `http://localhost:8000/auth/google`;
    }
    

    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl
    );

    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email  openid",
      prompt: "consent",
    });
    
    res.status(200).json({ url: authorizeUrl });
  })

 router.get('/getUser',googleAuthUser);

 router.post('/forgot-verify',forgotVerify);
 router.post('/resetPassword' , resetPassword);

 router.get('/blocked/:user/:userId',authenticate,blockedUser);

export default router;
