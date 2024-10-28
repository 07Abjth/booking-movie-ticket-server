 import express from 'express';
import { createCheckoutSession } from '../../controllers/paymentControllers.js';
import { getSeatDetailsByIds } from '../../controllers/seatControllers.js';

const router = express.Router();

// router.post('/create-intent', createPaymentIntent); // Removed the `:Id`

router.post('/create-checkout-session',createCheckoutSession )


// Seat details route
router.post('/get-seat-details', getSeatDetailsByIds);

export default router;
