import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { doctorAccessChat, doctorFetchChats, patientAccessChat,patientFetchChats } from '../controller/chatController.js';


const router = express.Router();

router.route('/patient').post(authenticate,patientAccessChat);
router.route('/patient').get(authenticate,patientFetchChats);
router.route('/doctor').post(authenticate,doctorAccessChat);
router.route('/doctor').get(authenticate,doctorFetchChats);


export default router;