import Stripe from 'stripe';
import Booking from '../models/bookingModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        // Verify the webhook signature
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.sendStatus(400);
    }

    // Handle specific event types
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        if (session.payment_status === 'paid') {
            // Logic for booking creation after payment
            const newBooking = new Booking({
                user: session.metadata.userId,
                movie: JSON.parse(session.metadata.movieDetails),
                theater: JSON.parse(session.metadata.theaterDetails),
                showTime: session.metadata.showTime,
                selectedSeats: JSON.parse(session.metadata.selectedSeats),
                totalAmount: session.amount_total / 100,
                paymentStatus: 'paid',
                transactionId: session.id,
            });
            await newBooking.save();
        }
    }

    res.sendStatus(200); // Respond to Stripe to confirm receipt
};
