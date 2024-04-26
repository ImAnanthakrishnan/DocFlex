import express from 'express';

import {authenticate} from '../middleware/authMiddleware.js';
import { TimeSchedule } from '../controller/emailController.js';

const router = express.Router();

router.post('/',authenticate,TimeSchedule);

export default router;

