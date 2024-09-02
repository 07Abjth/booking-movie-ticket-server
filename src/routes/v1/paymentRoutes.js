import express from 'express';
import { createPayment, getPaymentById } from '../../controllers/paymentControllers.js';

const router = express.Router();

// Route to create a new payment
router.post('/', createPayment);

// Route to get payment details by ID
router.get('/:id', getPaymentById);

export default router;
