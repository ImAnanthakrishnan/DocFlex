import mongoose from "mongoose";

const messageModel = mongoose.Schema({
    doctorSender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor'
    }
    ,userSender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    content:{
        type:String,
        trim:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat'
    }
},{timestamps:true});

const Message = mongoose.model("Message",messageModel);

export default Message;