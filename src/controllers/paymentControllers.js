import Payment from '../models/paymentModel.js';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe('YOUR_STRIPE_SECRET_KEY');

// Create a new payment
export const createPayment = async (req, res) => {
  try {
    const { bookingId, amount, tokenId } = req.body;

    // Create a charge with Stripe
    const charge = await stripe.charges.create({
      amount: amount * 100, // Amount in cents
      currency: 'inr',
      description: `Booking Payment for ${bookingId}`,
      source: tokenId, // The token ID from Stripe.js
    });

    // Create and save the payment record
    const payment = new Payment({
      booking: bookingId,
      stripePaymentId: charge.id,
      amount: amount,
      status: charge.status === 'succeeded' ? 'Completed' : 'Failed',
    });

    await payment.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get payment details by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
