import express from 'express';

import { updateDoctor,getAllDoctor,getAllApprovedDoctor, getSingleDoctor, getMyAppointments } from '../controller/doctorController.js';
import { authenticate } from '../middleware/authMiddleware.js';

import reviewRouter from './review.js';

const router = express.Router();

//nested route
router.use('/:doctorId/reviews',reviewRouter);

router.put('/:id', authenticate ,updateDoctor);
router.get('/getAllDoctors' ,authenticate , getAllDoctor);
router.get('/getAllApprovedDoctors' ,authenticate , getAllApprovedDoctor);
router.get('/getSingleDoctor/:doctorId', authenticate , getSingleDoctor);
router.get('/getAppointments', authenticate , getMyAppointments);
export default router