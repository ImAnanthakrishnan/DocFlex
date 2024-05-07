import asyncHandler from 'express-async-handler';
import Chat from '../models/chatModel.js';
import User from '../models/userModel.js';
import Doctor from '../models/doctorModel.js';
import Message from '../models/messageModel.js';


export const patientAccessChat = asyncHandler(async(req,res) => {
   const {userId} = req.body;
  
   if(!userId){
    return res.status(400).json({success:false,message:"Bad request"});
   }

   var isChat = await Chat.find({
        $and:[
         {user:req.userId},
         {doctor:userId},
        ]
   }).populate("user","-password")
   .populate("doctor","-password")
     .populate("latestMessage");
   
      isChat = await Doctor.populate(isChat,{
      path:'latestMessage.doctorSender',
      select:"name photo email"
     });

    
     if(isChat.length > 0){
      res.send(isChat[0]);
     } else {
     
      var charData = {
         chatName:"sender",
         user:req.userId,
         doctor:userId
      };

      try{
         const createdChat = await Chat.create(charData);
       
         const FullChat = await Chat.findOne({_id:createdChat._id}).populate(
               "user",
               "-password"
         )
         .populate(
            "doctor",
            "-password"
         );
         res.status(200).send(FullChat);
      }
      catch(err){
         res.status(400);
      throw new Error(err.message)
      }
     }
});

export const patientFetchChats = asyncHandler(async(req,res) => {
   try{
    let result = await Chat.find({user:req.userId})
     .populate("user","-password")
     .populate("doctor","-password")
     .populate("latestMessage")
     .sort({updatedAt:-1});
   
     let result1 = await Doctor.populate(result,{
      path:"latestMessage.doctorSender",
      select:"name photo email"
     })
   
     let result2 = await User.populate(result,{
      path:"latestMessage.userSender",
      select:"name photo email"
     })

     let results = result1 ? result1 : result2;
     
     res.status(200).send(results);
   }
   catch(err){
      res.status(400);
      throw new Error(err.message)
   }
})

export const doctorAccessChat = asyncHandler(async(req,res) => {
   const {userId} = req.body;
  
   if(!userId){
    return res.status(400).json({success:false,message:"Bad request"});
   }

   var isChat = await Chat.find({
        $and:[
         {user:userId},
         {doctor:req.userId},
        ]
   }).populate("user","-password")
   .populate("doctor","-password")
     .populate("latestMessage");
   
      isChat = await User.populate(isChat,{
      path:'latestMessage.userSender',
      select:"name photo email"
     });

    
     if(isChat.length > 0){
      res.send(isChat[0]);
     } else {
     
      var charData = {
         chatName:"sender",
         user:userId,
         doctor:req.userId
      };

      try{
         const createdChat = await Chat.create(charData);
       
         const FullChat = await Chat.findOne({_id:createdChat._id}).populate(
               "user",
               "-password"
         )
         .populate(
            "doctor",
            "-password"
         );
         res.status(200).send(FullChat);
      }
      catch(err){
         res.status(400);
      throw new Error(err.message)
      }
     }
});

export const doctorFetchChats = asyncHandler(async(req,res) => {
   try{
    let result = await Chat.find({doctor:req.userId})
     .populate("user","-password")
     .populate("doctor","-password")
     .populate("latestMessage")
     .sort({updatedAt:-1});
   
     let results ;

     if(result[0].latestMessage.userSender){
     let result1 = await User.populate(result,{
      path:"latestMessage.userSender",
      select:"name photo email"
     });
     results = result1;
   } else {
     let result2 = await Doctor.populate(result,{
      path:"latestMessage.doctorSender",
      select:"name photo email"
     });
     results = result2;
   }

     console.log('results-',results);

     res.status(200).send(results);
   }
   catch(err){
      res.status(400);
      throw new Error(err.message)
   }
})