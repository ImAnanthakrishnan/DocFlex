import { populate } from "dotenv";
import Booking from "../models/bookingModel.js";
import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import { all, cancelled, completed, upcoming } from "../helpers/appointmentStatus.js";

export const getAllUser = asyncHandler(async (req, res) => {
  let users = null;
  const { query } = req.query;
  if (query) {
    const searchCriteria = {
      is_admin: 0,
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

      searchCriteria.$or.push({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      });
    }

    users = await User.find(searchCriteria)
      .select("-password")
      .sort({ createdAt: -1 });
  } else {
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
    const { query, status } = req.query;

    //retrieve appointments from booking for specific user
    /*  const bookings = await Booking.find({ user: req.userId }).sort({
      createdAt: -1,
    });

    //extract doctor ids from appointment bookings
    const doctorIds = bookings.map((el) => el.doctor._id);
    let doctors = null;
    let allDoctors = null;*/

    //retrieve doctors using doctor ids

    let appointment = null;
    if (query) {
      const searchCriteria = {
        user: req.userId,
        $or: [
          { "doctor.name": { $regex: query, $options: "i" } },
          { "doctor.specialization": { $regex: query, $options: "i" } },
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

      appointment = await Booking.find(searchCriteria)
        .populate({
          path: "doctor",
          select:
            "name gender photo timeSlots onlineTimeSlots experience ticketPrice phone totalRating averageRating specialization",
        })
        .sort({ createdAt: -1 });
    } else if (status) {
      if (status === "All") {
        appointment = await all(req,'patient');
      } else if (status === "Upcoming") {
        appointment = await upcoming(req,'patient');
      } else if (status === "Completed") {
        appointment = await completed(req,'patient');
      } else {
        appointment = await cancelled(req,'patient');
      }
    } else {
      appointment = await Booking.find({ user: req.userId })
        .populate({
          path: "doctor",
          select:
            "name gender photo timeSlots onlineTimeSlots experience  phone totalRating averageRating specialization",
        })
        // populate("Doctor", "name gender phone photo totalRating averageRating specialization")
        .sort({ createdAt: -1 });
    }
    /* allDoctors = doctors.map(
      ({ password, updatedAt, __v, $__, $isNew, ...rest }) => rest
    );*/

    const data = appointment.map((booking) => ({
      _id: booking.doctor._id,
      name: booking.doctor.name,
      photo: booking.doctor.photo,
      phone: booking.doctor.phone,
      ticketPrice: booking.ticketPrice,
      specialization: booking.doctor.specialization,
      experience: booking.doctor.experience,
      timeSlots: booking.doctor.timeSlots,
      onlineTimeSlots: booking.doctor.onlineTimeSlots,
      averageRating: booking.doctor.averageRating,
      totalRating: booking.doctor.totalRating,
      createdAt: booking.createdAt,
      appointmentDate: {
        day: booking.appointmentDate.day,
        startingTime: booking.appointmentDate.startingTime,
        endingTime: booking.appointmentDate.endingTime,
        date: booking.appointmentDate.date,
      },
      modeOfAppointment: booking.modeOfAppointment,
      status: booking.status,
      bookingId:booking._id
    }));

    res.status(200).json({
      success: true,
      message: "Appointments are getting",
      data,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: true, message: "Something went wrong,cannot get" });
  }
};

export const allDoctors = asyncHandler(async (req, res) => {
  let bookings,users;

  const keyword = req.query.search;

 
  if (keyword) {
      // Fetch upcoming doctors based on the search criteria
      bookings= await upcoming(req, 'patient');

      let filteredDoctor = bookings.map(booking => booking.doctor);

      const regex = new RegExp(keyword,"i")// "i" flag for case-insensitive matching
      
      // Filter doctors based on email or name matching the search query using regex
      filteredDoctor = filteredDoctor.filter(doctor => 
        regex.test(doctor.email) || regex.test(doctor.name)
      );
    
      users = filteredDoctor;

  } /*else {
      
      users = await Booking.find({ user: req.userId })
      .populate({
        path: "doctor",
        select:
          "name gender photo timeSlots onlineTimeSlots experience  phone totalRating averageRating specialization",
      })
      .sort({ createdAt: -1 });
  }*/

  res.json(users);
});
