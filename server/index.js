import express from 'express';
const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import path,{dirname} from 'path';
import { fileURLToPath } from 'url';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

mongoose.connect(process.env.MONGO_URL, {
})
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.log('Error connecting to MongoDB:',err)
});

app.use(cors());

app.use(express.static(path.join(__dirname,'public')));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen( PORT, () => console.log(`Server listening on port ${PORT}`));