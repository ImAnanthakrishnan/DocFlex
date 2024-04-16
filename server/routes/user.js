import express from 'express';

import { authenticate } from '../middleware/authMiddleware.js';
import { deleteUser, getAllUser, getMyAppointments, updateUser } from '../controller/userController.js';

const router = express.Router();

router.get('/getAllUsers' ,authenticate , getAllUser);

router.route('/:id')
.put(authenticate , updateUser)
.delete(authenticate,deleteUser);

router.get('/appointments/my-appointments', authenticate , getMyAppointments);

export default router