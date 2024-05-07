import express from 'express';
import { walletCredit,walletDebit } from '../controller/walletController.js';
import {authenticate,restrict} from '../middleware/authMiddleware.js';
const router = express.Router();


router.post('/credit',authenticate,restrict(['patient']) ,walletCredit);
router.post('/debit',authenticate,restrict(['patient']) ,walletDebit);

export default router;