import express from 'express';
import {
  createSeats,
  getSeatsForShow,
  reserveSeats,
  fetchSeatLayout,
  deleteSeats,
  getSeatsByTheaterId,
   getSeatPricesForShow,
  getSeatPriceByShowSeatId,
  getSeatPricesBySeatNumber,
  getSeatDetailsByIds
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

  
   


router.get('/price/:seatId', getSeatPricesBySeatNumber); 



router.get('/seats/prices/:showId', getSeatPricesForShow);




// Define the route to get seat price by ShowSeat ID
router.get('/seats/price/:showSeatId', getSeatPriceByShowSeatId);


//get seat details by id
router.post('/get-seat-details',getSeatDetailsByIds);


export default router;
