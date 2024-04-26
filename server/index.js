import express from 'express';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import logger from 'morgan';

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

app.use(express.static(path.join(__dirname,'public')));


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



app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;


app.listen( PORT, () => console.log(`Server listening on port ${PORT}`));