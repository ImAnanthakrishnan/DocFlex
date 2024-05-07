import express from 'express';

import { updateDoctor,getAllDoctor,getAllApprovedDoctor, getSingleDoctor, getMyAppointments, allUsers } from '../controller/doctorController.js';
import { authenticate,restrict } from '../middleware/authMiddleware.js';

import reviewRouter from './review.js';

const router = express.Router();

//nested route
router.use('/:doctorId/reviews',reviewRouter);

router.put('/:id', authenticate ,restrict(['doctor']),updateDoctor);
router.get('/getAllDoctors' ,authenticate ,restrict(['patient','admin']), getAllDoctor);
router.get('/getAllApprovedDoctors' ,authenticate ,restrict(['patient']), getAllApprovedDoctor);
router.get('/getSingleDoctor/:doctorId', authenticate,restrict(['patient','admin']) , getSingleDoctor);
router.get('/getAppointments', authenticate ,restrict(['doctor']), getMyAppointments);

router.get('/doctor',authenticate,allUsers)
export default router