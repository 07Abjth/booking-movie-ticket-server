import express from 'express';
import {
  createCheckoutSession,
  getSessionStatus,
  getBookingsBySession
} from '../../controllers/paymentControllers.js';
import { authUser } from '../../middleware/authUser.js';

const router = express.Router();

router.post('/create-checkout-session', authUser, createCheckoutSession);
router.get('/session-status/:sessionId', authUser, getSessionStatus);
router.get('/booking-details', authUser, getBookingsBySession);

export default router;
