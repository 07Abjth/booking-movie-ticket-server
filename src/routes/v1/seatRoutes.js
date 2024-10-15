import express from 'express';
import {
  createSeats,
  getSeatsForShow,
  reserveSeats,
  fetchSeatLayout,
  deleteSeats,
  getSeatsByTheaterId,
  getSeatPrices,
  getSeatPricesForShow,
  getSeatPriceByShowSeatId,
  getSeatPricesBySeatNumber
 } from '../../controllers/seatControllers.js';
 import authTheaterOwnerOrAdmin from '../../middleware/authTheaterOwnerOrAdmin.js';
  
const router = express.Router();

// Route to create seats in bulk (restricted to theater owners and admins)
router.post('/create',   createSeats);


// Route to get all seats for a specific show
router.get('/show/:showId', getSeatsForShow);

// Route to reserve seats for booking
router.post('/reserve', reserveSeats);

// Route to get seat layout for a specific theater and show
router.get('/seats/:theaterId/:showId', fetchSeatLayout);

// Route to delete seats (restricted to theater owners and admins)
router.delete('/delete', authTheaterOwnerOrAdmin, deleteSeats);



// router.get('/get-seats-by-theater-id/:theaterId', getSeatsByTheaterId);

router.get('/get-seats-by-theater-id/:theaterId', getSeatsByTheaterId);

  

// // Define the route for fetching seats and their prices
// router.get('/get-seats-and-seat-price-from-theater-and-showId/:theaterId/:showId', getSeatsAndSeatsPriceFromTheaterAndShowId);




// // Route to get the seat price
// router.get('/price/:seatId', getSeatPrices);


router.get('/price/:seatId', getSeatPricesBySeatNumber); 



router.get('/seats/prices/:showId', getSeatPricesForShow);




// Define the route to get seat price by ShowSeat ID
router.get('/seats/price/:showSeatId', getSeatPriceByShowSeatId);


export default router;
