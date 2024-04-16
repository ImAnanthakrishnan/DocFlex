import asyncHandler from "express-async-handler";
import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";

export const updateDoctor = asyncHandler(async (req, res) => {
  const id = req.params.id;
  console.log('r-',req.body);
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    const { password, updatedAt, __v, createdAt, ...rest } = updatedDoctor._doc;
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: { ...rest },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
});

export const getAllApprovedDoctor = asyncHandler(async (req, res) => {
  try {
    const { query } = req.query;

    let doctors;

    if (query) {
      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      doctors = await Doctor.find({ isApproved: "approved" }).select(
        "-password"
      );
    }
    const allDoctors = doctors.map(
      ({ password, updatedAt, __v, $__, $isNew, ...rest }) => rest
    );
    res.status(200).json({
      success: true,
      message: "doctors found",
      data: allDoctors,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
});

export const getAllDoctor = asyncHandler(async (req, res) => {
  const { query } = req.query;
  let doctors = null;

  if (query) {
    const searchCriteria = {
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

      searchCriteria.$or.push({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
    }

    doctors = await Doctor.find(searchCriteria)
      .select("-password")
      .sort({ createdAt: -1 });
  } else {
    doctors = await Doctor.find({}).select("-password").sort({ createdAt: -1 });
  }

  if (doctors) {
    const allDoctors = doctors.map(
      ({ password, updatedAt, __v, $__, $isNew, ...rest }) => rest
    );
    res
      .status(200)
      .json({ success: true, message: "Success", data: allDoctors });
  } else {
    res.status(404).json({ success: false, message: "Doctors not Found" });
  }
});

export const getSingleDoctor = asyncHandler(async (req, res) => {
  const { doctorId } = req.params;

  let doctor = null;

  if (doctorId) {
    doctor = await Doctor.findById({ _id: doctorId }).select("-password");

    if (doctor) {
      return res.status(200).json({ success: true, data: doctor });
    }

    return res.status(404).json({ success: false, message: "Not found" });
  } else {
    return res.status(400).json({ success: false, message: "Bad request" });
  }
});

export const getMyAppointments = async (req, res) => {
  try {
    const { query } = req.query;
    let bookings = null;

    if (query) {
      // Check if query is a valid date string
      if (new Date(query) instanceof Date && !isNaN(new Date(query))) {
        const startOfDay = new Date(query);
        startOfDay.setHours(0, 0, 0, 0); // Set time to start of the day

        const endOfDay = new Date(query);
        endOfDay.setHours(23, 59, 59, 999); // Set time to end of the day

        bookings = await Booking.find({
          doctor: req.userId,
          createdAt: { $gte: startOfDay, $lt: endOfDay },
        })
          .populate("user", "name gender photo email") // Populate the 'user' field with 'name' and 'gender'
          .select("createdAt") // Select only 'createdAt'
          .select("ticketPrice") // Select only 'ticketPrice'
          .select("isPaid")
          .sort({ createdAt: -1 });
      } else {
        
        const searchCriteria = {
          doctor: req.userId,
          $or: [
            { "user.name": { $regex: query, $options: "i" } },
            { "user.email": { $regex: query, $options: "i" } },
          ],
        };

        bookings = await Booking.find(searchCriteria)
          .populate({
            path: "user",
            select: "name gender photo email",
          })
          .sort({ createdAt: -1 });
      }
      console.log("bo-", bookings);
    } else {
      bookings = await Booking.find({ doctor: req.userId })
        .populate("user", "name gender photo email") // Populate the 'user' field with 'name' and 'gender'
        .select("createdAt") // Select only 'createdAt'
        .select("ticketPrice") // Select only 'ticketPrice'
        .select("isPaid")
        .sort({ createdAt: -1 });
    }

    console.log(bookings);

    const data = bookings.map((booking) => ({
      name: booking.user.name,
      gender: booking.user.gender,
      email: booking.user.email,
      photo: booking.user.photo,
      ticketPrice: booking.ticketPrice,
      isPaid: booking.isPaid,
      createdAt: booking.createdAt,
    }));

    res
      .status(200)
      .json({ success: true, message: "data fetched successfully", data });

    //  const userIds = bookings.map(el => el.user._id);

    // const users = await User.find({_id:{$in:userIds}}).select('-password');
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ success: false, message: "Failed fetching data" });
  }
};
