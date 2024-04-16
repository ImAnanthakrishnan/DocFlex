import mongoose from "mongoose";

const doctorSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      //required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      //unique:true
    },
    gender:{
      type:String,
      //required:true
    },
    photo: {
      type: String,
    },
    ticketPrice: {
      type: Number,
    },
    is_blocked:{
      type:Boolean,
      default:false
    },
    token:{
      type:String,
      default:''
  },
    // Fields for doctors only
    specialization: {
      type: String,
    },
    qualification: {
      type: Array,
    },

    experience: {
      type: Array,
    },

    bio: {
      type: String,
      maxLength: 50,
    },
    timeSlots: {
      type: Array,
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    appointments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Booking",
      },
    ],
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
