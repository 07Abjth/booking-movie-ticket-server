import express from 'express';
import { getSeatsByShow, reserveSeats } from '../../controllers/seatControllers.js';
import { authUser } from '../../middleware/authUser.js'; // Assuming you have an authUser middleware for authentication

const router = express.Router();

// Route to get available seats for a specific show
router.get('/show/:showId', getSeatsByShow);

// Route to reserve seats (protected route)
router.post('/reserve', authUser, reserveSeats);

export default router;
