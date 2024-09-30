// import razorpayInstance from "../config/razorPayInstance";
// import * as crypto from 'crpto';


// const order = async (req,res)=>{
//   const {amount} = req.body;

//   try {
//     const options = {
//         amount: Number("100"),
//         currency: "INR",
//         receipt: crypto.randomBytes(10).toString("hex")
//     };

//     razorpayInstance.orders.create(options, (error, order)=>{
//       if(error){
//         console.log(error);
//         return res.status(500).json({message: "Something went wrong"})
        
//       }
//   return res.status(200).json({data:order});
// console.log(order);


//     })

//   } catch (error) {
//     res.status(500).json({message: "Internal server error"})
//   }

// }


// import razorPayInstance from '../config/razorPayInstance.js';
import crypto from 'crypto'; // Correct the crypto import

// Create payment order
export const createOrder = async (req, res) => {
 const { amount } = req.body; // Amount should come from frontend

 try {
   const options = {
     amount: amount * 100, // Razorpay expects the amount in paise (1 INR = 100 paise)
     currency: 'INR',
     receipt: crypto.randomBytes(10).toString('hex'), // Random receipt ID
   };

   // Create order on Razorpay
   const order = await razorpayInstance.orders.create(options);

   // Send the order ID back to the frontend
   res.status(200).json({ orderId: order.id, amount: order.amount, currency: order.currency });
 } catch (error) {
   console.error('Error creating Razorpay order:', error);
   res.status(500).json({ message: 'Error creating Razorpay order', error });
 }
};

