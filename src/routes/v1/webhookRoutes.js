import express from 'express';
import { handleStripeWebhook } from '../../controllers/webhookController.js';

const router = express.Router();

// Webhook route for Stripe

router.get('/webhook',  handleStripeWebhook);

export default router;
