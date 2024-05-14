import Review from "../models/reviewModel.js";
import Doctor from "../models/doctorModel.js";

import asyncHandler from "express-async-handler";

//get all non-authenticated reviews
export const getAllNonAuthReviews = asyncHandler(async(req,res) => {
  try{
   let reviews = await Review.find().limit(6).sort({_id:-1});
   console.log('Revew-',reviews)
   console.log('reviews-',await Review.find())
   res
   .status(200)
   .json({ success: true, message: "Successfull", data: reviews });
  }
  catch(err){
    console.log('reviewsError-',err);
  }
});

//get all reviews
export const getAllReviews = asyncHandler(async (req, res) => {
  try {
        let reviews = await Review.find({doctor:req.params.doctorId});
    
    res
      .status(200)
      .json({ success: true, message: "Successfull", data: reviews });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
});

//create review
export const createReview = async (req, res) => {


  if (!req.body.doctor) req.body.doctor = req.params.doctorId;
  if (!req.body.user) req.body.user = req.userId;


  const newReview = new Review(req.body);

  try {
    const savedREview = await newReview.save(); 

    await Doctor.findByIdAndUpdate(req.body.doctor, {
      $push: { reviews: savedREview._id },
    });
    res
      .status(200)
      .json({ success: true, message: "Review submitted", data: savedREview });
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: err.message });
  }
};
