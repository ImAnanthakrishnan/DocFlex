import Booking from "../models/bookingModel.js";

export const all = async(req,user) => {

    if(user === 'patient'){
        return await Booking.find({ user: req.userId })
        .populate({
          path: "doctor",
          select:
            "name gender photo timeSlots onlineTimeSlots experience  phone totalRating averageRating specialization",
        })
     
        .sort({ createdAt: -1 });
    }else if(user === 'doctor'){
        return await Booking.find({ doctor: req.userId })
        .populate("user", "name gender photo email") 
        .sort({ createdAt: -1 });
    }


}

export const upcoming = async(req,user) => {
    let bookings = null;
    if(user === 'patient'){
         bookings = await Booking.find({user : req.userId})
        .populate({
            path: "doctor",
            select:
              "name gender photo email timeSlots onlineTimeSlots experience  phone totalRating averageRating specialization",
          })
       
          .sort({ createdAt: -1 });
    }else if(user === 'doctor'){
        bookings = await Booking.find({ doctor: req.userId })
        .populate("user", "name gender photo email") 
        .sort({ createdAt: -1 });
    }

    const currentDate = new Date();

   return bookings.filter(ele => new Date(ele.appointmentDate.date) >= currentDate);

}

export const completed = async(req,user) => {
    let bookings = null;
    if(user === 'patient'){
         bookings = await Booking.find({user : req.userId})
        .populate({
            path: "doctor",
            select:
              "name gender photo timeSlots onlineTimeSlots experience  phone totalRating averageRating specialization",
          })
       
          .sort({ createdAt: -1 });
    }else if(user === 'doctor'){
        bookings = await Booking.find({ doctor: req.userId })
        .populate("user", "name gender photo email") 
        .sort({ createdAt: -1 });
    }

    const currentDate = new Date();

   return bookings.filter(ele => new Date(ele.appointmentDate.date) < currentDate);

}

export const cancelled = async(req,user) => {

    if(user === 'patient'){
        return await Booking.find({ user: req.userId , status:'cancelled' })
        .populate({
          path: "doctor",
          select:
            "name gender photo timeSlots onlineTimeSlots experience  phone totalRating averageRating specialization",
        })
      
        .sort({ createdAt: -1 });
    }else if(user === 'doctor'){
        return  await Booking.find({ doctor: req.userId,status:'cancelled' })
        .populate("user", "name gender photo email") 
        .sort({ createdAt: -1 });
    } 

}