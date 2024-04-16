import express from 'express';

import { updateDoctor,getAllDoctor,getAllApprovedDoctor, getSingleDoctor, getMyAppointments } from '../controller/doctorController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/:id', authenticate ,updateDoctor);
router.get('/getAllDoctors' ,authenticate , getAllDoctor);
router.get('/getAllApprovedDoctors' ,authenticate , getAllApprovedDoctor);
router.get('/getSingleDoctor/:doctorId', authenticate , getSingleDoctor);
router.get('/getAppointments', authenticate , getMyAppointments);
export default router