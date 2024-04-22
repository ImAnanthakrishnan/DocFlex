import express from 'express';

import {authenticate} from '../middleware/authMiddleware.js';
import { emailsender } from '../controller/jitsjiEmailController.js';

const router = express.Router();

router.post('/',authenticate,emailsender);

export default router;

