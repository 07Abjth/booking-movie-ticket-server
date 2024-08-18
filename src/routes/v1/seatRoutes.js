import express from 'express';
import {
  getSeatsByShow,
  reserveSeats,
} from '../controllers/seatControllers.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to get available seats for a specific show
router.route('/show/:showId').get(getSeatsByShow);

// Route to reserve seats
router.route('/reserve').post(protect, reserveSeats);

export default router;
