import express from 'express';
import { getSeatsByShow, reserveSeats } from '../../controllers/seatControllers.js';
// import { protect } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Route to get available seats for a specific show
router.get('/show/:showId', getSeatsByShow);

// Route to reserve seats
router.post('/reserve',  reserveSeats);

export default router;
