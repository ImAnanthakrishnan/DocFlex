import express from 'express'

import {block, statusChange, unBlock} from '../controller/adminController.js'

import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.patch('/doctor-statusChange', authenticate, statusChange);

router.patch('/block/:id', authenticate , block);

router.patch('/unblock/:id' , authenticate , unBlock);

export default router;