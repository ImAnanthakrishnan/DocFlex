import express from 'express';
import { addPrescription, getAllPrescription } from '../controller/prescriptionController.js';
import {authenticate} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:id',authenticate,addPrescription);

router.get('/getPrescription',authenticate,getAllPrescription);

export default router;