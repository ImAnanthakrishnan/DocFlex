import express from "express";
import User from "../models/userModel.js";
import { OAuth2Client } from "google-auth-library";
import Doctor from "../models/doctorModel.js";

const router = express.Router();

router.get("/google", async function (req, res, next) {
  const code = req.query.code;
  console.log(code);
  try {
    const redirectUrl = `${process.env.SERVER_URL}/auth/google`;
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl
    );
    const result = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(result.tokens);
    console.log("Tokens acquired");
    const user = oAuth2Client.credentials;
    console.log("credentials", user);
    let data = await getUserData(user.access_token);
    console.log(data);

   let newUser = await User.findOne({ email: data.email });
  
   if(!newUser){
    return res.redirect(`${process.env.CLIENT_SITE_URL}/login?message=${'You are already registered,please login'}`)
   }
    
      newUser = new User({
        name: data.name,
        email: data.email,
        photo: data.picture,
        phone:'+91',
        is_verified:true
      });
      try {
        let savedUser = await newUser.save();
        console.log('User saved:', savedUser);
      } catch (saveError) {
        console.error('Error saving user:', saveError);
      }
     return res.redirect(`${process.env.CLIENT_SITE_URL}/login?email=${data.email}`);    
    

  } catch (err) {
    console.log(err)
    res.redirect(`${process.env.CLIENT_SITE_URL}/login`);
  }
});

router.get("/google1", async function (req, res, next) {
  const code = req.query.code;
  console.log(code);
  try {
    const redirectUrl = `${process.env.SERVER_URL}/auth/google1`;
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl
    );
    const result = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(result.tokens);
    console.log("Tokens acquired");
    const user = oAuth2Client.credentials;
    console.log("credentials", user);
    let data = await getUserData(user.access_token);
    console.log(data);
   
   let newUser = await Doctor.findOne({ email: data.email });
  
   if(!newUser){
    return res.redirect(`${process.env.CLIENT_SITE_URL}/doctor/login?message=${'You are already registered,please login'}`)
   }

 
      newUser = new Doctor({
        name: data.name,
        email: data.email,
        photo: data.picture,
       // phone:'+91',
        //is_verified:true
      });
      try { 
        let savedUser = await newUser.save();
        console.log('User saved:', savedUser);
      } catch (saveError) {
        console.error('Error saving user:', saveError);
      }
      res.redirect(`${process.env.CLIENT_SITE_URL}/doctor/login?email=${data.email}`);
    
   

  } catch (err) {
    console.log(err)
    res.redirect(`${process.env.CLIENT_SITE_URL}doctor/login`);
  }
});

router.get('/googleLogin',async(req,res) => {
  const code = req.query.code;
  try{
    const redirectUrl = `${process.env.SERVER_URL}/auth/googleLogin`;
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl
    );
    const result = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(result.tokens);
    
    const user = oAuth2Client.credentials;
   
    let data = await getUserData(user.access_token);
   
   
   let newUser = await User.findOne({ email: data.email });

    if(!newUser){
      return res.redirect(`${process.env.CLIENT_SITE_URL}/login?message=${'You are not registered'}`);

    }

    res.redirect(`${process.env.CLIENT_SITE_URL}/login?email=${data.email}`);

  }
  catch(err){
    console.log(err)
    res.redirect(`${process.env.CLIENT_SITE_URL}/login`);
  }
});

router.get('/googleLogin1',async(req,res) => {
  const code = req.query.code;
  try{
    const redirectUrl = `${process.env.SERVER_URL}/auth/googleLogin1`;
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl
    );
    const result = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(result.tokens);
    
    const user = oAuth2Client.credentials;
   
    let data = await getUserData(user.access_token);
   
   
   let newUser = await Doctor.findOne({ email: data.email });

    if(!newUser){
      return res.redirect(`${process.env.CLIENT_SITE_URL}/doctor/login?message=${'You are not registered'}`);
    }

    res.redirect(`${process.env.CLIENT_SITE_URL}/doctor/login?email=${data.email}`);

  }
  catch(err){
    console.log(err)
    res.redirect(`${process.env.CLIENT_SITE_URL}doctor/login`);
  }
});

async function getUserData(access_token) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    //` https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
  );
  const data = await response.json();

  return data;
}

export default router;
