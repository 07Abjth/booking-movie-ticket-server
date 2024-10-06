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






import crypto from 'crypto';
import { payUConfig } from '../config/payUConfig.js';  

// Create a payment request
export const createPayment = (req, res) => {
    const { txnid, amount, productinfo, firstname, email } = req.body;

    // Generate the hash for PayU
    const hashString = `${payUConfig.key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${payUConfig.salt_32}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    // Create a payment request object
    const paymentRequest = {
        key: payUConfig.key,
        txnid: txnid,
        amount: amount,
        productinfo: productinfo,
        firstname: firstname,
        email: email,
        surl: payUConfig.surl,
        furl: payUConfig.furl,
        hash: hash,
    };

    res.json(paymentRequest); // Send this object to the frontend
};

// Handle payment response from PayU
export const handlePaymentResponse = (req, res) => {
    const response = req.body; // PayU sends the response here
    console.log('Payment Response:', response);

    // Validate response hash here
    const { txnid, amount, productinfo, firstname, email, status, key, hash } = response;
    const { salt_32 } = payUConfig;

    // Create the hash string following PayU's response pattern
    const hashString = `${salt_32}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    const expectedHash = crypto.createHash('sha512').update(hashString).digest('hex');

    if (hash === expectedHash) {
        if (status === 'success') {
            // Successful payment handling
            console.log('Payment Successful:', response);
            res.redirect('/booking-confirmation'); // Redirect to confirmation page
        } else {
            // Failed payment handling
            console.log('Payment Failed:', response);
            res.redirect('/retry-payment'); // Redirect to retry payment page
        }
    } else {
        console.error('Invalid hash:', response);
        res.status(400).send('Payment response hash is invalid.');
    }
};

// Success callback route for PayU Money
export const paymentSuccess = (req, res) => {
    const payUResponse = req.body; // PayU sends the response here
    console.log('Payment Success:', payUResponse);
    
    // Handle success response (redirected from handlePaymentResponse)
    res.send('Payment was successful.'); // You can render a success page instead
};

// Failure callback route for PayU Money
export const paymentFailure = (req, res) => {
    const payUResponse = req.body; // PayU sends the response here
    console.log('Payment Failed:', payUResponse);
    
    // Handle failure response (redirected from handlePaymentResponse)
    res.send('Payment failed. Please try again.'); // You can render a failure page instead
};



// Generate a PayU hash
export const getPayUHash = (data) => {
    const { txnid, amount, productinfo, firstname, email } = data;
    const hashString = `${payUConfig.key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${payUConfig.salt_32}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
};
