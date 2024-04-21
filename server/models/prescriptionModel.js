import mongoose from "mongoose";



const prescriptiSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Types.ObjectId,
            ref:"User"
        },
        doctor:{
            type:mongoose.Types.ObjectId,
            ref:"Doctor"
        },
        medicines:[{
            name:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            time_gap:{
                type:String,
                required:true
            }
        }],
        symptoms:{
            type:String,
            required:true
        },
        disease:{
            type:String,
            required:true
        },
        testReports:[{
                img:{
                  type:  String,
                required:true
                }
            }
        ]
    },{timestamps:true}
);

const Prescription = mongoose.model("Prescription",prescriptiSchema);
export default Prescription;