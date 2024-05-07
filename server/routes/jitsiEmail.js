import express from 'express';

import {authenticate,restrict} from '../middleware/authMiddleware.js';
import { emailsender } from '../controller/jitsjiEmailController.js';

const router = express.Router();

router.post('/',authenticate,restrict(['doctor']),emailsender);

export default router;

