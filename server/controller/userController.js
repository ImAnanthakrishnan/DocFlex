import Booking from "../models/bookingModel.js";
import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

export const getAllUser = asyncHandler(async (req, res) => {
  let users = null;
  const { query } = req.query;
  if (query) {
    const searchCriteria = {
      is_admin:0,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    };

    // Check if query is a valid date string
    if (new Date(query) instanceof Date && !isNaN(new Date(query))) {
      const startOfDay = new Date(query);
      startOfDay.setHours(0, 0, 0, 0); // Set time to start of the day
    
      const endOfDay = new Date(query);
      endOfDay.setHours(23, 59, 59, 999); // Set time to end of the day
    
      searchCriteria.$or.push({ createdAt: { $gte: startOfDay, $lte: endOfDay } })
    }

    users = await User.find(searchCriteria).select("-password").sort({createdAt:-1});
  }else{
    users = await User.find({ is_admin: 0 })
    .select("-password")
    .sort({ createdAt: -1 });
  }


  if (users) {
    const allUsers = users.map(
      ({ password, updatedAt, __v, $__, $isNew, ...rest }) => rest
    );
    res.status(200).json({ success: true, message: "Success", data: allUsers });
  } else {
    res.status(404).json({ success: false, message: "Users not Found" });
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    let duplicateUser = await User.findOne({
      _id: { $ne: id },
      $or: [{ email }, { phone: concatenatedNumber }],
    });

    if (duplicateUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body.formData },
      { new: true }
    );
    const { password, updatedAt, __v, createdAt, ...rest } = updatedUser._doc;

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: { ...rest },
    });
  } catch (err) {
    res.status(500).json({ success: true, message: "Failed to update" });
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: true, message: "Failed to delete" });
  }
});

export const getMyAppointments = async (req, res) => {
  try {
    const { query } = req.query;
    //retrieve appointments from booking for specific user
    const bookings = await Booking.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    //extract doctor ids from appointment bookings
    const doctorIds = bookings.map((el) => el.doctor._id);
    let doctors = null;
    let allDoctors = null;

    //retrieve doctors using doctor ids
    if (query) {
      const searchCriteria = {
        _id: { $in: doctorIds },
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      };

      // Check if query is a valid date string
      if (new Date(query) instanceof Date && !isNaN(new Date(query))) {
        const startOfDay = new Date(query);
        startOfDay.setHours(0, 0, 0, 0); // Set time to start of the day
      
        const endOfDay = new Date(query);
        endOfDay.setHours(23, 59, 59, 999); // Set time to end of the day
      
        searchCriteria.$or.push({ createdAt: { $gte: startOfDay, $lte: endOfDay } })
      }

      doctors = await Doctor.find(searchCriteria).sort({ createdAt: -1 });
    } else {
      doctors = await Doctor.find({ _id: { $in: doctorIds } })
        .select("-password")
        .sort({ createdAt: -1 });
    }
    allDoctors = doctors.map(
      ({ password, updatedAt, __v, $__, $isNew, ...rest }) => rest
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Appointments are getting",
        data: allDoctors,
      });
  } catch (err) {
    res
      .status(500)
      .json({ success: true, message: "Something went wrong,cannot get" });
  }
};
