import asyncHandler from "express-async-handler";
import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";
//status change of doctor , whether to approve or reject
export const statusChange = asyncHandler(async (req, res) => {
  const { status, doctorId } = req.body;

  let doctor = null;

  if (status === "approve") {
    doctor = await Doctor.findByIdAndUpdate(doctorId, {
      isApproved: "approved",
    });
    if (doctor) {
      res
        .status(200)
        .json({ success: true, message: `Dr.${doctor.name} is approved` });
    }
  } else {
    doctor = await Doctor.findByIdAndUpdate(doctorId, {
      isApproved: "cancelled",
    });
    if (doctor) {
      res
        .status(200)
        .json({ success: true, message: `Dr.${doctor.name} is cancelled` });
    }
  }
});

export const block = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { patient, doctor } = req.body;

  let updated = null;

  if (patient)
    updated = await User.findByIdAndUpdate(
      id,
      { is_blocked: true },
      { new: true }
    );

  if (doctor)
    updated = await Doctor.findByIdAndUpdate(
      id,
      { is_blocked: true },
      { new: true }
    );

  if (updated) {
    return res
      .status(200)
      .json({ success: true, message: ` ${updated.name} is blocked` });
  } else {
    return res.status(404).json({ error: "Not found" });
  }
});

export const unBlock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { patient, doctor } = req.body;

  let updated = null;

  if (patient)
    updated = await User.findByIdAndUpdate(
      id,
      { is_blocked: false },
      { new: true }
    );

  if (doctor)
    updated = await Doctor.findByIdAndUpdate(
      id,
      { is_blocked: false },
      { new: true }
    );

  if (updated) {
    return res
      .status(200)
      .json({ success: true, message: ` ${updated.name} is unblocked` });
  } else {
    return res.status(404).json({ error: "Not found" });
  }
});

export const extraCharges = asyncHandler(async (req, res) => {
  const { id, extraCharges } = req.body;

  if (!extraCharges || !id) {
    return res.status(400).json({ success: false, message: "Bad request" });
  }

  const charges = await Doctor.findByIdAndUpdate(id, {
    $set: { extraCharges },
  });

  if (!charges) {
    return res
      .status(400)
      .json({ success: false, message: "Charges didnt applied" });
  }

  res.status(200).json({ success: true, message: "Charges applied" });
});

export const reports = asyncHandler(async (req, res) => {
  const { query, status } = req.query;
  try {
    let bookings = null;

    if (query) {
      // Check if query is a valid date string
      if (new Date(query) instanceof Date && !isNaN(new Date(query))) {
        const startOfDay = new Date(query);
        startOfDay.setHours(0, 0, 0, 0); // Set time to start of the day

        const endOfDay = new Date(query);
        endOfDay.setHours(23, 59, 59, 999); // Set time to end of the day

        bookings = await Booking.find({
          "appointmentDate.date": {
            $gt: startOfDay.toISOString().split("T")[0], // Convert to ISO date format (YYYY-MM-DD)
            $lte: endOfDay.toISOString().split("T")[0], // Convert to ISO date format (YYYY-MM-DD)
          },
        })
          .populate("user", "name photo email") // Populate the 'user' field with 'name' and 'gender'
          .populate("doctor", "ticketPrice extraCharges")
          .sort({ createdAt: -1 });
      } else {
        bookings = await Booking.find({})
          .populate({
            path: "user",
            select: "name email photo ",
            match: {
              $or: [
                { name: { $regex: new RegExp(query, "i") } }, // Case-insensitive search for user name
                { email: { $regex: new RegExp(query, "i") } }, // Case-insensitive search for user email
              ],
            },
          })
          .populate({
            path: "doctor",
            select: "ticketPrice extraCharges",
          })
          .sort({ createdAt: -1 });
      }
    } else if (status) {
      if (status === "Paid") {
        bookings = await Booking.find({ status: "approved" })
          .populate("user", "name gender photo email")
          .populate("doctor", "ticketPrice extraCharges")
          .sort({ createdAt: -1 });
      } else if (status === "Cancelled") {
        bookings = await Booking.find({ status: "cancelled" })
          .populate("user", "name gender photo email")
          .populate("doctor", "ticketPrice extraCharges")
          .sort({ createdAt: -1 });
      } else if (status === "All") {
        bookings = await Booking.find({})
          .populate("user", "name gender photo email") // Populate the 'user' field with 'name' and 'gender'
          .populate("doctor", "ticketPrice extraCharges")
          .sort({ createdAt: -1 });
      }
    } else {
      bookings = await Booking.find({})
        .populate("user", "name gender photo email") // Populate the 'user' field with 'name' and 'gender'
        .populate("doctor", "ticketPrice extraCharges")
        .sort({ createdAt: -1 });
    }

    const data = bookings.map((booking) => ({
      name: booking.user.name,
      email: booking.user.email,
      photo: booking.user.photo,
      ticketPrice: booking.doctor.ticketPrice,
      extraCharges: booking.doctor.extraCharges,
      totalCharges: booking.ticketPrice,
      createdAt: booking.createdAt,
      status: booking.status,
    }));

    res
      .status(200)
      .json({ success: true, message: "data fetched successfully", data });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ success: false, message: "Failed fetching data" });
  }
});

export const dashboardCountData = asyncHandler(async(req,res) => {

  const {query} = req.query;

  try{
    //patient's count
    let patientsCount = await User.countDocuments();

    //doctor's count
    let doctorsCount =  await Doctor.countDocuments();
    
    //bookings count
    let bookingsCount = await Booking.find({status:'approved'}).countDocuments();

    //cancelled count
    let cancelledCount = await Booking.find({status:'cancelled'}).countDocuments();
    ////////////////////////////////////////////////////////////////////////////////


    const currentYear = new Date().getFullYear(); // Get the current year
// Function to get the count of bookings for a given status (approved or canceled) for a given month and year
const getCountForMonthAndStatus = async (status, chart, month, year) => {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const startDate = new Date(year, month - 1, 1); // Start of the month
  const endDate = new Date(year, month, 0); // End of the month

 if(chart === 'bar'){
  // Query bookings for the current month, year, and status
  const bookingsCount = await Booking.countDocuments({
    status: status,
    createdAt: { $gte: startDate, $lte: endDate }
  });

  return { month: monthNames[month - 1], count: bookingsCount }; // Return the month name and count
 } else if(chart === 'line') {

  const charges = await Booking.find({
      status:status,
      createdAt: { $gte: startDate, $lte: endDate }
  })
  .select("ticketPrice")
  .populate("doctor","ticketPrice extraCharges");



  return {month : monthNames[month - 1] , charges: charges}

 }

};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // booking data's
    //bar chart
// Array to store the counts for each month for both approved and canceled bookings
const countsByMonth = [];

// Loop through each month from January to December
for (let i = 1; i <= 12; i++) {
  const approvedCountForMonth = await getCountForMonthAndStatus('approved','bar', i, currentYear);
  const canceledCountForMonth = await getCountForMonthAndStatus('cancelled', 'bar' ,  i, currentYear);
  countsByMonth.push({ month: approvedCountForMonth.month, approved: approvedCountForMonth.count, cancelled: canceledCountForMonth.count });
}

// Send the response with counts for each month
console.log('Counts for current year:', countsByMonth);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//revenue data's
//line chart

const countsByMonthLine = [];

for(let i = 1 ; i <= 12 ; i++){
  const revenue= await getCountForMonthAndStatus('approved','line',i,currentYear);
  // Initialize variables to store sums
  let ticketPriceSum = 0;
  let extraChargesSum = 0;
  let totalChargesSum = 0;

  // Check if revenue.charges is an array and has items
  if (Array.isArray(revenue.charges) && revenue.charges.length > 0) {
    // Calculate the sum of ticketPrice, extraCharges, and totalCharges for each item in revenue.charges
    ticketPriceSum = revenue.charges.reduce((total, item) => item.doctor.ticketPrice + total,0);

    extraChargesSum = revenue.charges.reduce((total, item) => item.doctor.extraCharges + total, 0);

    totalChargesSum = revenue.charges.reduce((total, item) => Number(item.ticketPrice) + total, 0);
  }

  countsByMonthLine.push(
    {
      month : revenue.month , 
      ticketPrice: ticketPriceSum || 0,
      extraCharges: extraChargesSum || 0,
      totalCharges: totalChargesSum || 0,
    }
  )
}

console.log('line-',countsByMonthLine)

const data = {
  patients : patientsCount,
  doctors : doctorsCount,
  bookings : bookingsCount,
  cancelled : cancelledCount,
  barChartData : countsByMonth,
  lineChartData : countsByMonthLine
}

  res.status(200).json({success:true,data})


  }
  catch(err){
    res.status(500).json({success:false,message:'Internal server error'})
    console.log(err.message)
  }

});
