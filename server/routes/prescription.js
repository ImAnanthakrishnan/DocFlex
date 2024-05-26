import express from 'express';
import { addPrescription, getAllPrescription,editPrescription } from '../controller/prescriptionController.js';
import {authenticate,restrict} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:id',authenticate,restrict(['doctor']),addPrescription);

router.patch('/:id',authenticate,restrict(['doctor']),editPrescription);

router.get('/getPrescription',authenticate,restrict(['patient','doctor']),getAllPrescription);



export default router;