import asyncHandler from "express-async-handler";
import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";
import { all,completed,cancelled,upcoming } from "../helpers/appointmentStatus.js";

export const updateDoctor = asyncHandler(async (req, res) => {
  const id = req.params.id;
  //console.log('r-',req.body);

  const onlineData = req.body.onlineTimeSlots.map((items,index) => {
    return items;
  });

  const offlineData = req.body.timeSlots.map((items,index) => {
    return items;
  });

  //time conflicts checking

  const conflicts = [];

  onlineData.forEach(onlineSlot => {
    offlineData.forEach(offlineSlot => {
      if(onlineSlot.day === offlineSlot.day){
        const onlineStartTime = new Date(`1970-01-01T${onlineSlot.startingTime}:00`);
        const onlineEndTime = new Date(`1970-01-01T${onlineSlot.endingTime}:00`);
        const offlineStartTime = new Date(`1970-01-01T${offlineSlot.startingTime}:00`);
        const offlineEndTime = new Date(`1970-01-01T${offlineSlot.endingTime}:00`);

        if(
          (onlineStartTime <= offlineEndTime && onlineEndTime >= offlineStartTime) ||
          (offlineStartTime <= onlineEndTime && offlineEndTime >= onlineStartTime)
        ) 
        {
          conflicts.push({
            onlineSlot,
            offlineSlot,
            message:'Conflict detected'
          })
        }

      }
    })
  })

  if(conflicts.length > 0){
    return res.status(400).json({success:false,message:"There is a conflict detected in time"})
  }
  

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

    res.status(200).json({
      success: true,
      message: "doctors found",
      data: doctors,
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
    doctor = await Doctor.findById({ _id: doctorId })
    .populate("reviews")
    .select("-password");

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
    const { query,status } = req.query;
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
          'appointmentDate.date': {
            $gt: startOfDay.toISOString().split('T')[0], // Convert to ISO date format (YYYY-MM-DD)
            $lte: endOfDay.toISOString().split('T')[0], // Convert to ISO date format (YYYY-MM-DD)
          },
        })
          .populate("user", "name gender photo email") // Populate the 'user' field with 'name' and 'gender'

          .sort({ createdAt: -1 });
      } else {
        
        const searchCriteria = {
          doctor: req.userId,
        };
        
        bookings = await Booking.find(searchCriteria)
          .populate({
            path: "user",
            select: "name email gender photo ", 
            match: {
              $or: [
                { name: { $regex: new RegExp(query, 'i') } }, // Case-insensitive search for user name
                { email: { $regex: new RegExp(query, 'i') } }, // Case-insensitive search for user email
              ],
            },
          })
          .sort({ createdAt: -1 });

      }
    
    } else if(status){
      if (status === "All") {
        bookings = await all(req,'doctor');
      } else if (status === "Upcoming") {
        bookings  = await upcoming(req,'doctor');
      } else if (status === "Completed") {
        bookings = await completed(req,'doctor');
      } else {
        bookings = await cancelled(req,'doctor');
      }
    }else {

      bookings = await Booking.find({ doctor: req.userId })
        .populate("user", "name gender photo email") // Populate the 'user' field with 'name' and 'gender'
        .sort({ createdAt: -1 });
    }

    

    const data = bookings.map((booking) => ({
      _id:booking.user._id,
      name: booking.user.name,
      gender: booking.user.gender,
      email: booking.user.email,
      photo: booking.user.photo,
      ticketPrice: booking.ticketPrice,
      modeOfAppointment:booking.modeOfAppointment,
      isPaid: booking.isPaid,
      createdAt: booking.createdAt,
      status:booking.status
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

export const allUsers = asyncHandler(async (req, res) => {
  let bookings,doctors;

  const keyword = req.query.search;


  if (keyword) {
      // Fetch upcoming doctors based on the search criteria
      bookings= await upcoming(req, 'doctor');

      let filteredUsers = bookings.map(booking => booking.user);

      const regex = new RegExp(keyword,"i")// "i" flag for case-insensitive matching
  
      // Filter doctors based on email or name matching the search query using regex
      filteredUsers = filteredUsers.filter(user => 
        regex.test(user.email) || regex.test(user.name)
      );

      doctors = filteredUsers;

  } 

  res.json(doctors);
});
