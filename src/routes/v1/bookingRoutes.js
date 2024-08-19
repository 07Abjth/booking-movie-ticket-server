import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
} from '../../controllers/bookingControllers.js';
// import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to create a new booking
router.post('/create',  createBooking);

// Route to get all bookings for a specific user
router.get('/mybookings', getUserBookings);

// Route to get a specific booking by ID
router.get('/:id', getBookingById);

// Route to cancel a booking
router.put('/:id/cancel', cancelBooking);

export default router;
