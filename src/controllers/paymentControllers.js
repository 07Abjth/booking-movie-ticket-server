// import Razorpay from 'razorpay'; // Ensure you've imported Razorpay
// import crypto from 'crypto'; // Correct the crypto import
// import dotenv from 'dotenv';

// dotenv.config(); // Load environment variables from .env

// const razorpayInstance = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_SECRET,
// });

// // Create payment order
// export const createOrder = async (req, res) => {
//   const { amount } = req.body; // Amount should come from frontend

//   try {
//     const options = {
//       amount: Number(amount * 100), // Razorpay expects the amount in paise (1 INR = 100 paise)
//       currency: 'INR',
//       receipt: crypto.randomBytes(10).toString('hex'), // Random receipt ID
//     };

//     // Create order on Razorpay
//     const order = await razorpayInstance.orders.create(options);
//     console.log(order);

//     // Send the order ID back to the frontend
//     res.status(200).json({ orderId: order.id, amount: order.amount, currency: order.currency });
//   } catch (error) {
//     console.error('Error creating Razorpay order:', error);
//     res.status(500).json({ message: 'Error creating Razorpay order', error });
//   }
// };
