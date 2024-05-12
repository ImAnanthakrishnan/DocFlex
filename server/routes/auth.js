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
import {
  checkBlockedDoctor,
  checkBlockedPatient,
} from "../middleware/block_ublock.js";

const router = express.Router();

router.post("/register", register);

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/login", checkBlockedPatient, userLogin);

router.post("/doctor-login", checkBlockedDoctor, doctorLogin);

router.post("/admin-login", adminLogin);

router.post("/", async function (req, res, next) {
  const user = req.query.user;
  const status = req.query.status;

  res.header("Access-Control-Allow-Origin", `${process.env.CLIENT_SITE_URL}`);
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  let redirectUrl = null;

  if (status === "register") {
    if (user === "doctor") {
      redirectUrl = `${process.env.SERVER_URL}/auth/google1`;
    } else {
      redirectUrl = `${process.env.SERVER_URL}/auth/google`;
    }
  } else if (status === "login") {
    if (user === "doctor") {
      redirectUrl = `${process.env.SERVER_URL}/auth/googleLogin1`;
    } else {
      redirectUrl = `${process.env.SERVER_URL}/auth/googleLogin`;
    }
  }

  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email  openid",
    prompt: "consent",
  });

  res.status(200).json({ url: authorizeUrl });
});

router.get("/getUser", googleAuthUser);

router.post("/forgot-verify", forgotVerify);
router.post("/resetPassword", resetPassword);

router.get("/blocked/:user/:userId", authenticate, blockedUser);

export default router;
