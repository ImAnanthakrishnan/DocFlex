import mongoose from "mongoose";

const chatModel = mongoose.Schema({
    chatName:{
        type:String,
        trim:true
    },
    /*isGroupChat:{
        type:Boolean,
        default:false
    },*/
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    /*groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor"
    }*/
},{timestamps:true});

const Chat = mongoose.model("Chat",chatModel);

export default Chat;