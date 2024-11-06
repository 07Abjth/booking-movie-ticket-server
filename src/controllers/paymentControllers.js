

//  import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Secret key from .env

// const frontend_url = process.env.FRONTEND_URL



// export const createPaymentIntent = async (req, res) => {
//   try {
//     const { amount, currency } = req.body; // amount in smallest currency unit (e.g., 1000 = $10)
    
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency,
//       automatic_payment_methods: { enabled: true },  // Automatically select payment methods
//     });
    
//     res.status(200).json({
//       success: true,
//       clientSecret: paymentIntent.client_secret,  // Send client_secret to the frontend
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


//  //checkout session 

// export const createCheckoutSession = async (req, res) => {
  
  
  
  
//     // const { priceId } = req.body; // Get the price or amount from the request body

//   try {

//     const {products} = req.body

//     const lineItems = products.map((product)=> ({
//         price_data:{
//             currency:"inr",
//             product_data:{
//                 name:product.name,
//                 images:[product.image],
//             },
//             unit_amount:Math.round(product.price * 100),
//         },
//         quantity:product.quantity,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],  // You can add more payment methods like 'upi', 'ideal', etc.
//       mode: 'payment',  // 'payment' is used for one-time payments. For subscriptions, use 'subscription'
//       line_items: lineItems,
//       success_url: `${process.env.FRONTEND_URL}/user/payment/success`,  // Redirect after success
//       cancel_url: `${process.env.FRONTEND_URL}/user/payment/cancel`,  // Redirect after cancel
//     });

//     res.status(200).json({ success: true, sessionId: session.id });  // Send the session ID to frontend
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };



// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Secret key from .env

// const frontend_url = process.env.FRONTEND_URL;

// export const createPaymentIntent = async (req, res) => {
//   try {
//     const { amount, currency } = req.body;

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency,
//       automatic_payment_methods: { enabled: true },
//     });

//     // Debugging: Log the clientSecret and paymentIntent ID
//     console.log('Client Secret:', paymentIntent.client_secret);
//     console.log('Payment Intent ID:', paymentIntent.id);

//     res.status(200).json({
//       success: true,
//       clientSecret: paymentIntent.client_secret,  // Send the clientSecret to the frontend
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// // Checkout session
// export const createCheckoutSession = async (req, res) => {
//   try {
//     const { products } = req.body;

//     const lineItems = products.map((product) => ({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: product.name,
//           images: [product.image],
//         },
//         unit_amount: Math.round(product.price * 100),
//       },
//       quantity: product.quantity,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       mode: 'payment',
//       line_items: lineItems,
//       success_url: `${frontend_url}/user/payment/success`,
//       cancel_url: `${frontend_url}/user/payment/cancel`,
//     });

//     res.status(200).json({ success: true, sessionId: session.id });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };






// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 

// const frontend_url = process.env.FRONTEND_URL


// export const createCheckoutSession = async (req, res) => {
//   try {
//       console.log("Request body:", req.body); // Log the request body

//       const { products } = req.body;

//       if (!products || products.length === 0) {
//           return res.status(400).json({ success: false, message: "No products found in request." });
//       }

//       const lineItems = products.map((product) => {
//           if (typeof product.price !== 'number' || product.price <= 0) {
//               throw new Error(`Invalid price for product: ${product.name}`);
//           }
//           return {
//               price_data: {
//                   currency: "inr",
//                   product_data: {
//                       name: product.name,
//                       // Add image URL here if available
//                       // images: [product.image],
//                   },
//                   unit_amount: Math.round(product.price * 100), // Ensure price is in smallest currency unit
//               },
//               quantity: product.quantity,
//           };
//       });

//       const frontend_url = process.env.FRONTEND_URL || 'http://localhost:3000';

//       const session = await stripe.checkout.sessions.create({
//           payment_method_types: ['card'],
//           mode: 'payment',
//           line_items: lineItems,
//           success_url: `${frontend_url}/user/payment/success`,
//           cancel_url: `${frontend_url}/user/payment/cancel`,
//       });

//       res.status(200).json({ success: true, sessionId: session.id });
//   } catch (error) {
//       console.error("Error creating checkout session:", error); // Log the error
//       res.status(500).json({
//           success: false,
//           message: error.message,
//       });
//   }
// };



// import Stripe from 'stripe';
// import Seat from '../models/seatModel.js';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // Fetch seat details by IDs
// export const fetchSeatDetails = async (seatIds) => {
//     try {
//         const seats = await Seat.find({ _id: { $in: seatIds } });
//         return seats;
//     } catch (error) {
//         console.error('Error fetching seat details:', error.message);
//         throw new Error('Failed to fetch seat details');
//     }
// };

// // Create checkout session
// export const createCheckoutSession = async (req, res) => {
//     const { products } = req.body;

//     try {
//         const seatIds = products.map(product => product.id);
//         const seats = await fetchSeatDetails(seatIds);

//         const validProducts = seats.map(seat => ({
//             name: `Seat ID: ${seat.seatId}`,
//             price: seat.price,
//             quantity: 1,
//         })).filter(product => product.price !== undefined);

//         if (validProducts.length === 0) {
//             return res.status(400).send({ error: 'No valid products for payment' });
//         }

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: validProducts.map(product => ({
//                 price_data: {
//                     currency: 'usd',
//                     product_data: {
//                         name: product.name,
//                     },
//                     unit_amount: product.price * 100, // Convert to cents
//                 },
//                 quantity: product.quantity,
//             })),
//             mode: 'payment',
//             success_url: `${process.env.CLIENT_URL}/success`,
//             cancel_url: `${process.env.CLIENT_URL}/cancel`,
//         });

//         res.json({ id: session.id });
//     } catch (error) {
//         console.error('Error creating checkout session:', error.message);
//         res.status(500).send({ error: 'Internal Server Error' });
//     }
// };



// import Stripe from 'stripe';
// import Seat from '../models/seatModel.js';


// // Fetch seat details by IDs
// export const fetchSeatDetails = async (seatIds) => {
//     try {
//         const seats = await Seat.find({ _id: { $in: seatIds } });
//         return seats;
//     } catch (error) {
//         console.error('Error fetching seat details:', error.message);
//         throw new Error('Failed to fetch seat details');
//     }
// };


// import Stripe from 'stripe';
// import Seat from '../models/seatModel.js';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//  export const createCheckoutSession = async (req, res) => {
//     try {
//           const { products } = req.body;
//     console.log('Received products:', products);

//     // Check for missing IDs or prices
//     const hasInvalidProduct = products.some(product => !product.id || product.price === null);
//     if (hasInvalidProduct) {
//         return res.status(400).send({ error: 'Invalid products: each product must have an id and price' });
//     }

//     const seatIds = products.map(product => product.id);
//     console.log('Mapped Seat IDs:', seatIds);

  
//         const seats = await fetchSeatDetails(seatIds);
//         console.log('Fetched Seat Details:', seats);

//         const validProducts = seats.map(seat => ({
//             name: `Seat ID: ${seat._id}`,
//             price: seat.price,
//             quantity: 1,
//         }));

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: validProducts.map(product => ({
//                 price_data: {
//                     currency: 'usd',
//                     product_data: {
//                         name: product.name,
//                     },
//                     unit_amount: product.price * 100,
//                 },
//                 quantity: product.quantity,
//             })),
//             mode: 'payment',
//             success_url: `${process.env.CLIENT_URL}/success`,
//             cancel_url: `${process.env.CLIENT_URL}/cancel`,
//         });

//         console.log('Stripe session created:', session.id);
//         res.json({ id: session.id });
//     } catch (error) {
//         console.error('Error creating checkout session:', error);
//         res.status(500).send({ error: 'Internal Server Error' });
//     }
// };


// import Stripe from 'stripe';
// import Seat from '../models/seatModel.js';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const createCheckoutSession = async (req, res) => {
//     try {
//         const { products } = req.body;
//         console.log('Received products:', products);

//         // Additional check: log products before mapping
//         if (!products || products.length === 0) {
//             console.error('No products found in request.');
//             return res.status(400).send({ error: 'No products provided' });
//         }

//         const hasInvalidProduct = products.some(product => !product.id || product.price === null);
//         if (hasInvalidProduct) {
//             console.error('Invalid products:', products);
//             return res.status(400).send({ error: 'Invalid products: each product must have an id and price' });
//         }

//         const seatIds = products.map(product => product.id);
//         console.log('Mapped Seat IDs:', seatIds);

//         const seats = await fetchSeatDetails(seatIds);  // Assuming this function fetches the seat details from DB
//         console.log('Fetched Seat Details:', seats);

//         if (!seats || seats.length === 0) {
//             console.error('No seat details found for IDs:', seatIds);
//             return res.status(404).send({ error: 'Seats not found' });
//         }

//         // Map seat details to valid products for Stripe
//         const validProducts = seats.map(seat => ({
//             name: `Seat ID: ${seat._id}`,
//             price: seat.price,
//             quantity: 1,
//         }));

//         // Create Stripe session
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: validProducts.map(product => ({
//                 price_data: {
//                     currency: 'inr',
//                     product_data: { 
//                         name: product.name,
//                         // Assuming each seat has an 'image' field, otherwise remove the image line
//                         images: [product.image || 'default-image-url'], // Provide default image if not available
//                     },
//                     unit_amount: product.price * 100, // Convert to paise (smallest currency unit)
//                 },
//                 quantity: product.quantity,
//             })),
//             mode: 'payment',
//             success_url: `${process.env.CLIENT_URL}/success`,
//             cancel_url: `${process.env.CLIENT_URL}/cancel`,
//         });

//         console.log('Stripe session created:', session.id);
//         res.json({ id: session.id });
//     } catch (error) {
//         console.error('Error creating checkout session:', error);
//         res.status(500).send({ error: 'Internal Server Error' });
//     }
// };

// // Helper function to fetch seat details from the database
// async function fetchSeatDetails(seatIds) {
//     try {
//         const seats = await Seat.find({ _id: { $in: seatIds } });
//         return seats;
//     } catch (error) {
//         console.error('Error fetching seat details:', error);
//         throw new Error('Error fetching seat details');
//     }
// }








// export const createCheckoutSession = async (req, res) => {
  
  
//     // const { priceId } = req.body; // Get the price or amount from the request body

//   try {

//     const {products} = req.body

//     const lineItems = products.map((product)=> ({
//         price_data:{
//             currency:"inr",
//             product_data:{
//                 name:product.name,
//                 images:[product.image],
//             },
//             unit_amount:Math.round(product.price * 100),
//         },
//         quantity:product.quantity,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],  // You can add more payment methods like 'upi', 'ideal', etc.
//       mode: 'payment',  // 'payment' is used for one-time payments. For subscriptions, use 'subscription'
//       line_items: lineItems,
//       success_url: `${process.env.FRONTEND_URL}/user/payment/success`,  // Redirect after success
//       cancel_url: `${process.env.FRONTEND_URL}/user/payment/cancel`,  // Redirect after cancel
//     });

//     res.status(200).json({ success: true, sessionId: session.id });  // Send the session ID to frontend
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };







// Backend - Controller for creating a Stripe checkout session
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const { products } = req.body;

        const lineItems = products.map((product) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: product.movieTitle,
                    images: [product.image || ''],  // Replace with your image URL logic
                },
                unit_amount: Math.round(product.price * 100),  // Convert to the smallest currency unit
            },
            quantity: product.quantity || 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            success_url: `${process.env.FRONTEND_URL}/user/payment/success`,
            cancel_url: `${process.env.FRONTEND_URL}/user/payment/cancel`,
        });

        res.status(200).json({ success: true, sessionId: session.id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
