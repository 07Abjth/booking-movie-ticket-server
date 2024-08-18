import express from 'express';
import {
  createPayment,
  getPaymentById,
} from '../controllers/paymentControllers.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to create a new payment
router.route('/').post(protect, createPayment);

// Route to get payment details by ID
router.route('/:id').get(protect, getPaymentById);

export default router;
