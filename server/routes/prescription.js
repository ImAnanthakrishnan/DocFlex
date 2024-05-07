import express from 'express';
import { addPrescription, getAllPrescription } from '../controller/prescriptionController.js';
import {authenticate,restrict} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:id',authenticate,restrict(['doctor']),addPrescription);

router.get('/getPrescription',authenticate,restrict(['patient','doctor']),getAllPrescription);

export default router;