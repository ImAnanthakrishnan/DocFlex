import express from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import logger from 'morgan';
import {Server} from 'socket.io';

import path,{dirname} from 'path';
import { fileURLToPath } from 'url';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

app.use(logger('dev'));

const corsOption = {
    origin:true
}

app.use(cors(corsOption));



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// Define the path to the client build directory
/*const __dir1 = path.dirname('');
const buildPath = path.join(__dir1, '../client/dist');

// Serve static files from the client build directory
app.use(express.static(buildPath));



// Route for serving the index.html file
app.get('/*', function(req, res) {
    res.sendFile(
        'index.html',
        { root: path.join(__dir1, '../client/dist') },
        function(err) {
            if (err) {
                res.status(500).send(err);
            }
        }
    );
});*/

mongoose.connect(process.env.MONGO_URL, {
})
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.log('Error connecting to MongoDB:',err)
});

/*const corsOptions = {
    origin : true
}*/


import authRoute from './routes/auth.js'
import doctorRoute from './routes/doctors.js'
import adminRoute from './routes/admin.js';
import userRoute from './routes/user.js';
import oAuthRoute from './routes/oAuth.js';
import bookingRoute from './routes/booking.js';
import reviewRoute from './routes/review.js';
import prescriptionRoute from './routes/prescription.js';
import walletRoute from './routes/wallet.js';
import jitsiEmailRoute from './routes/jitsiEmail.js';
import emailRoute from './routes/email.js';
import chatRoute from './routes/chatRoute.js';
import messageRoute from './routes/messageRoute.js';




app.use('/api/v1/auth' , authRoute);
app.use('/api/v1/doctors',doctorRoute);
app.use('/api/v1/admin',adminRoute);
app.use('/api/v1/user',userRoute);
app.use('/auth',oAuthRoute);
app.use('/api/v1/bookings' , bookingRoute);
app.use('/api/v1/reviews',reviewRoute);
app.use('/api/v1/prescription',prescriptionRoute);
app.use('/api/v1/wallet',walletRoute);
app.use('/api/v1/email',jitsiEmailRoute);
app.use('/api/v1/email1',emailRoute);
app.use('/api/v1/chat',chatRoute);
app.use('/api/v1/message',messageRoute);



app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;


const appServer = app.listen( PORT, () => console.log(`Server listening on port ${PORT}`));

const io = new Server(appServer,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:5173"
    }
})

io.on("connection" , (socket) => {
    console.log("connected to socket.io");

    socket.on('setup' , (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room : " + room);
    });

    socket.on('typing' , (room) => socket.in(room).emit("typing"));
    socket.on('stop typing' , (room) => socket.in(room).emit("stop typing"));

    socket.on('new message' , (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if(!chat.user && !chat.doctor) return console.log('Chat users not defined');

            
        if(newMessageRecieved.doctorSender){
            if(chat.user == newMessageRecieved.doctorSender?._id) return;
        }else if(newMessageRecieved.userSender){
            if(chat.doctor == newMessageRecieved.userSender?._id ) return;
        }    
       
        socket.in(chat.user || chat.doctor).emit("message recieved",newMessageRecieved);
    });

    socket.off("setup",() =>{
        console.log("USER DISCONNECTED");
        socket.leave(userData._id)
    });

});

