import Doctor from "../models/doctorModel.js";
import Prescription from "../models/prescriptionModel.js";
import User from "../models/userModel.js";

import asyncHandler from "express-async-handler";

export const addPrescription = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const { formData } = req.body;

  const { symptoms, disease, medicines, testReport } = formData;

  try {
    // Fetch user and doctor details
    const user = await User.findById(userId);
    const doctor = await Doctor.findById(req.userId);

    if (!user || !doctor) {
      return res.status(404).json({ error: "User or doctor not found" });
    }

    // Create prescription object
    const prescriptionData = {
      doctor: doctor._id,
      user: user._id,
      symptoms,
      disease,
      medicines,
      testReports: testReport,
    };

    const prescription = new Prescription(prescriptionData);

    // Save prescription to the database
    await prescription.save();

    res
      .status(201)
      .json({ message: "Prescription added successfully", data: prescription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export const editPrescription = asyncHandler(async(req,res) => {
 
  const Id = req.params.id;

  const {formData} = req.body;

  const { symptoms, disease, medicines, testReport } = formData;

  try{
     let updatedData = await Prescription.findByIdAndUpdate(Id,{
      symptoms,
      disease,
      medicines,
      testReport
     },{new:true});

     res
     .status(201)
     .json({ message: "Prescription updated successfully", data: updatedData });

  }
  catch(err){
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }

});

export const getAllPrescription = asyncHandler(async (req, res) => {
  const { userId, doctorId,query } = req.query;

  if (!userId && !doctorId) {
    return res.status(400).json({ sucess: false, message: "Bad Request" });
  }
  let prescription = null;
  if (query) {
    const startOfDay = new Date(query);
    startOfDay.setHours(0, 0, 0, 0); // Set time to start of the day

    const endOfDay = new Date(query);
    endOfDay.setHours(23, 59, 59, 999); // Set time to end of the day

    prescription = await Prescription.find({
      user: userId,
      doctor: doctorId,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ createdAt: -1 });
  } else {
      prescription = await Prescription.find({
        user: userId,
        doctor: doctorId,
      }).sort({ createdAt: -1 });
  }

  if (!prescription) {
    return res
      .status(404)
      .json({ success: false, message: "Prescription not found" });
  }
  console.log(prescription);
  res.status(200).json({
    success: true,
    message: "Prescription founded successfully",
    data: prescription,
  });
});
