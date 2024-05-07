import asyncHandler from 'express-async-handler';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
import Chat from '../models/chatModel.js';
import Doctor from '../models/doctorModel.js';


export const allPatientMessages = asyncHandler(async(req,res) => {
    try{
        const messages = await Message.find({chat:req.params.chatId})
        .populate("userSender","name photo email")
        .populate("doctorSender","name photo email")
        .populate({
            path:"chat",
          /*   populate:{
                path:"latestMessage user",
            }*/
        });
      console.log('mess-',messages)
        res.json(messages);
    }
    catch(err){
        res.status(400);
        throw new Error(err.message);
    }
})

export const sendPatientMessage = asyncHandler(async(req,res) =>{
    const {content,chatId} = req.body;

    if(!content || !chatId){
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        userSender:req.userId,
        content:content,
        chat:chatId
    };

    try{
        var message = await Message.create(newMessage);

        message = await message.populate("userSender","name photo ")
       /* message = await message.populate({
            path:"chat",
            populate:{
                path:"latestMessage"
            }
        })*/
        message = await message.populate({
            path:"chat",
        })
        
        message = await User.populate(message,{
            path:'chat.user',
            select:"name photo email"
        });
       
        await Chat.findByIdAndUpdate(chatId,{
            latestMessage:message,
        })
        console.log(message);
        res.json(message);

    }
    catch(err){
        res.status(400);
        throw new Error(err.message);
    }
});

export const allDoctorMessages = asyncHandler(async(req,res) => {
    try{
        const messages = await Message.find({chat:req.params.chatId})
        .populate("doctorSender","name photo email")
        .populate("userSender","name photo email")
        .populate({
            path:"chat",
          /*   populate:{
                path:"latestMessage user",
            }*/
        });
        console.log('mess-',messages)
        res.json(messages);
    }
    catch(err){
        res.status(400);
        throw new Error(err.message);
    }
});

export const sendDoctorMessage = asyncHandler(async(req,res) => {
    const {content,chatId} = req.body;

    if(!content || !chatId){
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        doctorSender:req.userId,
        content:content,
        chat:chatId
    };

    try{
        var message = await Message.create(newMessage);

        message = await message.populate("doctorSender","name photo ")
       /* message = await message.populate({
            path:"chat",
            populate:{
                path:"latestMessage"
            }
        })*/
        message = await message.populate({
            path:"chat",
        })
        
        message = await Doctor.populate(message,{
            path:'chat.doctor',
            select:"name photo email"
        });
       
        await Chat.findByIdAndUpdate(chatId,{
            latestMessage:message,
        })
        console.log(message);
        res.json(message);

    }
    catch(err){
        res.status(400);
        throw new Error(err.message);
    }
});

