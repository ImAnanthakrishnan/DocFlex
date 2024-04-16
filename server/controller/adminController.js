import asyncHandler from 'express-async-handler';
import Doctor from "../models/doctorModel.js";
import User from '../models/userModel.js';
//status change of doctor , whether to approve or reject
export const statusChange = asyncHandler(async(req,res)=>{
    const {status,doctorId} = req.body;
 
    let doctor = null;

    if(status === 'approve'){
        doctor = await Doctor.findByIdAndUpdate(doctorId, { isApproved: 'approved' });
        if(doctor){
            res.status(200).json({success:true,message:`Dr.${doctor.name} is approved`});
        }
    }else{
        doctor = await Doctor.findByIdAndUpdate(doctorId, { isApproved: 'cancelled' });
        if(doctor){
            res.status(200).json({success:true,message:`Dr.${doctor.name} is cancelled`});
        }
    }
});

export const block = asyncHandler(async(req,res) => {
    console.log('ehlo')
    const {id} = req.params;
    const {patient,doctor} = req.body;

    console.log(doctor);
    console.log(id)

    let updated = null

    if(patient)
         updated = await User.findByIdAndUpdate(id, { is_blocked: true }, { new: true });

    if(doctor)
         updated = await Doctor.findByIdAndUpdate(id,{is_blocked:true},{new:true});

      if(updated){
        return res.status(200).json({success:true,message:` ${updated.name} is blocked`})
      }else{
        return res.status(404).json({ error: "Not found" });
      }

});

export const unBlock = asyncHandler(async(req,res) => {
    
    const {id} = req.params;
    const {patient,doctor} = req.body;

    let updated = null

    if(patient)
         updated = await User.findByIdAndUpdate(id, { is_blocked: false }, { new: true });

    if(doctor)
         updated = await Doctor.findByIdAndUpdate(id,{is_blocked:false},{new:true});

      if(updated){
        return res.status(200).json({success:true,message:` ${updated.name} is unblocked`})
      }else{
        return res.status(404).json({ error: "Not found" });
      }

});

