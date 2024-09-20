import express from 'express';
import { getSeatsByShow, reserveSeats, createSeats, deleteSeats } from '../../controllers/seatControllers.js';
import { authTheaterOwner } from '../../middleware/authTheaterOwner.js';

const router = express.Router();

// Route to get available seats for a specific show (open to all authenticated users)
router.get('/show/:showId', getSeatsByShow);

// Route to reserve seats (protected route for authenticated users)
router.post('/reserve', authTheaterOwner, reserveSeats);

// Route to create seats (protected route for Theater Owners only)
router.post('/create', authTheaterOwner, createSeats);

// Route to delete seats (protected route for Theater Owners only)
router.delete('/delete', authTheaterOwner, deleteSeats);

export default router;
