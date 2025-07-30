import Stripe from "stripe";
import Booking from "../models/bookingModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { products } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or empty products" });
    }

    const lineItems = products.map((product) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: product.movieTitle || "Movie Ticket",
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity || 1,
    }));

    const totalAmount = products.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/user/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/user/payment/cancel`,
     metadata: {
  userId: String(userId),
  seats: products.map(p => p.seatId).join(','),
  movie: String(products[0].movieId),
  theater: String(products[0].theaterId),
  show: String(products[0].showId),
  totalAmount: totalAmount.toFixed(2),
}
,
    });

    res.status(200).json({ success: true, sessionId: session.id });

  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ success: false, message: "Failed to create checkout session", error: error.message });
  }
};

// ✅ Get Stripe Session Status and Create Booking
// export const getSessionStatus = async (req, res) => {
//   try {
//     const { sessionId } = req.params;

//     if (!sessionId) {
//       return res.status(400).json({ success: false, message: "Session ID is required" });
//     }

//     const session = await stripe.checkout.sessions.retrieve(sessionId);

//     if (session.payment_status === "paid") {
//       const { userId, seats, movieId, theaterId } = session.metadata;

//       if (!userId || !seats || !movieId || !theaterId) {
//         return res.status(400).json({ success: false, message: "Missing metadata for booking" });
//       }

//       const seatIds = seats.split(',');

//       const existingBooking = await Booking.findOne({ sessionId });
//       if (existingBooking) {
//         return res.status(200).json({
//           success: true,
//           message: "Booking already exists",
//           booking: existingBooking,
//         });
//       }

//       const newBooking = new Booking({
//         sessionId,
//         user: userId,
//         movie: movieId,
//         theater: theaterId,
//         selectedSeats: seatIds,
//         totalAmount: session.amount_total / 100, // Convert paisa to INR
//         paymentStatus: session.payment_status,
//       });

//       await newBooking.save();

//       return res.status(201).json({
//         success: true,
//         message: "Booking created successfully",
//         booking: newBooking,
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Payment not completed",
//         paymentStatus: session.payment_status,
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching session status:", error.message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


// ✅ Get Booking Details by Session ID
export const getBookingsBySession = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ success: false, message: "Session ID is required." });
    }

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

export const getSessionStatus = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const { payment_status, metadata } = session;

    if (payment_status !== "paid") {
      return res.status(400).json({ success: false, message: "Payment not successful" });
    }

    const { userId, movie, theater, seats, totalAmount, showTime } = metadata;

    if (!userId || !movie || !theater || !seats || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing metadata for booking",
      });
    }

    const newBooking = await Booking.create({
      user: userId,
      movie,
      theater,
      showTime: showTime || metadata.showTime, // Use showTime instead of show
      selectedSeats: seats.split(','),
      totalAmount: parseFloat(totalAmount),
      paymentStatus: payment_status,
      sessionId,
    });

    res.status(200).json({
      success: true,
      booking: newBooking,
    });

  } catch (error) {
    console.error("Error fetching session:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to fetch session status",
      error: error.message,
    });
  }
};