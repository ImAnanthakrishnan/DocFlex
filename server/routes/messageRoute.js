import express from 'express';
import { authenticate,restrict } from '../middleware/authMiddleware.js';
import { allDoctorMessages, allPatientMessages, sendDoctorMessage, sendPatientMessage } from '../controller/messageController.js';

const router = express.Router();

router.route('/patient')
.post(authenticate,sendPatientMessage)

router.route('/patient/:chatId')
.get(authenticate,allPatientMessages);

router.route('/doctor')
.post(authenticate,sendDoctorMessage);

router.route('/doctor/:chatId')
.get(authenticate,allDoctorMessages);

export default router;