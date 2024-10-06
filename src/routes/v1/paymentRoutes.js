import express from 'express';
import {createPayment,
    handlePaymentResponse,
    paymentSuccess,
    paymentFailure,
    getPayUHash
 } from '../../controllers/paymentControllers.js';



const router = express.Router();


// Route to create a payment
router.post('/create-payment', createPayment);

// Route to handle the payment response from PayU
router.post('/payment-response', handlePaymentResponse);

// Success callback route
router.post('/payment-success', paymentSuccess);

// Failure callback route
router.post('/payment-failure', paymentFailure);


// Route to get the PayU hash
router.post('/getPayUHash', getPayUHash);


export default router;




 