import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    phoneNumber:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    expiration:{
        type:Date,
        default:Date.now,
        get:(expiration) => expiration.getTime(),
        set : (expiration) => new Date(expiration)
    }
});

const Otp = mongoose.model('Otp',otpSchema);
export default Otp