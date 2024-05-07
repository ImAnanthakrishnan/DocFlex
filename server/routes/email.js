import express from 'express';

import {authenticate,restrict} from '../middleware/authMiddleware.js';
import { TimeSchedule } from '../controller/emailController.js';

const router = express.Router();

router.post('/',authenticate,restrict(['doctor','admin']),TimeSchedule);

export default router;

