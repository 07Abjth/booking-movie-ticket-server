import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to create a new booking
router.route('/').post(protect, createBooking);

// Route to get all bookings for a specific user
router.route('/mybookings').get(protect, getUserBookings);

// Route to get a specific booking by ID
router.route('/:id').get(protect, getBookingById);

// Route to cancel a booking
router.route('/:id/cancel').put(protect, cancelBooking);

export default router;
