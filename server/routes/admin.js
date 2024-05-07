import express from 'express'

import {block, dashboardCountData, extraCharges, reports, statusChange, unBlock} from '../controller/adminController.js'

import { authenticate, restrict } from '../middleware/authMiddleware.js';

const router = express.Router();

router.patch('/doctor-statusChange', authenticate , restrict(['admin']) , statusChange);

router.patch('/block/:id', authenticate , restrict(['admin'])  , block);

router.patch('/unblock/:id' , authenticate , restrict(['admin']) , unBlock);

router.post('/extraCharges',authenticate , restrict(['admin'])  ,extraCharges);

router.get('/reports',authenticate, restrict(['admin'])  ,reports);

router.get('/dashboardData',authenticate , restrict(['admin'])  ,dashboardCountData);

export default router;