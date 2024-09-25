import express from 'express';
import {
  createSeats,
  getSeatsForShow,
  reserveSeats,
  fetchSeatLayout,
  deleteSeats,
  
} from '../../controllers/seatControllers.js';
import {  authTheaterOwner } from '../../middleware/authTheaterOwner.js';

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
router.delete('/delete', authTheaterOwner, deleteSeats);



export default router;
