 import express from 'express';
import { createCheckoutSession, getSessionStatus } from '../../controllers/paymentControllers.js';
 

const router = express.Router();

// router.post('/create-intent', createPaymentIntent); // Removed the `:Id`

router.post('/create-checkout-session',createCheckoutSession )


// Session status route
router.get('/session-status', getSessionStatus);


export default router;
