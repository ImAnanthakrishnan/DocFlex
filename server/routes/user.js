import express from 'express';

import { authenticate,restrict } from '../middleware/authMiddleware.js';
import { allDoctors, deleteUser, getAllUser, getMyAppointments, updateUser } from '../controller/userController.js';

const router = express.Router();

router.get('/getAllUsers' ,authenticate ,restrict(['admin']), getAllUser);

router.route('/:id')
.put(authenticate ,restrict(['patient']) ,updateUser)
.delete(authenticate,restrict(['patient']) ,deleteUser);

router.get('/appointments/my-appointments', authenticate ,restrict(['patient'])  ,getMyAppointments);

router.get('/users' ,authenticate,restrict(['patient']),allDoctors)
export default router;