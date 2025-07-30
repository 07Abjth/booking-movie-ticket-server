import Booking from "../models/bookingModel.js"; 
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Controller to check payment status and create booking
export const getSessionStatus = async (req, res) => {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({ success: false, message: "Session ID is required" });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === "paid") {
            const { userId, movieId, theaterId, selectedSeats, totalAmount } = session.metadata || {};

            if (!userId || !movieId || !theaterId || !selectedSeats || !totalAmount) {
                return res.status(400).json({ success: false, message: "Invalid session metadata" });
            }

            const existingBooking = await Booking.findOne({ sessionId: session_id });

            if (existingBooking) {
                return res.status(200).json({
                    success: true,
                    message: "Booking already exists",
                    booking: existingBooking,
                });
            }

            const newBooking = new Booking({
                sessionId: session_id,
                user: userId,
                movie: movieId,
                theater: theaterId,
                selectedSeats: JSON.parse(selectedSeats),
                totalAmount,
                paymentStatus: session.payment_status,
            });

            await newBooking.save();

            return res.status(201).json({
                success: true,
                message: "Booking created successfully",
                booking: newBooking,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Payment not completed",
                paymentStatus: session.payment_status,
            });
        }
    } catch (error) {
        console.error("Error fetching session status:", { message: error.message, stack: error.stack });
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ✅ Controller to fetch booking details by session
export const getBookingsBySession = async (req, res) => {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({ success: false, message: "Session ID is required." });
        }

        // Find the booking in the database
        const booking = await Booking.findOne({ sessionId: session_id }).populate("movie theater");

        if (!booking) {
            return res.status(404).json({ success: false, message: "No booking found for this session." });
        }

        res.status(200).json({ success: true, booking });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
};


