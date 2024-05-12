import express from 'express';

import {authenticate,restrict} from '../middleware/authMiddleware.js';
import { getCheckoutSession,cancelBooking,webhookStripe } from '../controller/bookingController.js';
const router = express.Router();

router.post('/checkout-session/:doctorId' , authenticate ,restrict(['patient']) , getCheckoutSession);
router.get('/cancel',authenticate,restrict(['patient']),cancelBooking);
//router.post('/webhooks/stripe',webhookStripe);
export default router;