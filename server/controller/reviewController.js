import Review from "../models/reviewModel.js";
import Doctor from "../models/doctorModel.js";

import asyncHandler from "express-async-handler";

//get all reviews
export const getAllReviews = asyncHandler(async (req, res) => {
  try {
    const reviews = await Review.find({});

    res
      .status(200)
      .json({ success: true, message: "Successfull", data: reviews });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
});

//create review
export const createReview = asyncHandler(async (req, res) => {
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
    res.status(500).json({ success: false, message: err.message });
  }
});
