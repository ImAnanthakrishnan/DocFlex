import mongoose from "mongoose";

const appointmentDateSchema = new mongoose.Schema({
  day: { type: String, required: true },
  startingTime: { type: String, required: true },
  endingTime: { type: String, required: true }
});

const bookingSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentDate:{
      type:appointmentDateSchema,
      required:true
    },
    session:{
      type:String,
      required:true
    },
    ticketPrice: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    modeOfAppointment:{
        type:String,
        enum:["online","offline"],
        required:true
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;