import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        //required:true
    },
    phone:{
        type:String,
        //required:true,
    },
    photo:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        //required:true
    },
    is_verified:{
        type:Boolean,
        default:false
    },
    token:{
        type:String,
        default:''
    },
    is_blocked:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        default:'patient'
    },
    is_admin:{
        type:Number,
        default:0
    },
},{timestamps:true});

const User = mongoose.model('User',userSchema);

export default User;