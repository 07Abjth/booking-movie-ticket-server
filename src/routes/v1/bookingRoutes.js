import express from 'express';
import {
  getUserBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
} from '../../controllers/bookingControllers.js';
import { authAdmin } from '../../middleware/authAdmin.js';
import { authUser } from '../../middleware/authUser.js';

const router = express.Router();

// Route to get all bookings for a specific user
router.get('/get-userBookings/:id', authUser, getUserBookings);

// Route to get all bookings of all users (Admin role)
router.get('/get-allBookings', authAdmin, getAllBookings);

// Route to get a specific booking by ID
router.get('/get-booking-by-id/:id', authUser, getBookingById);

// Route to cancel a booking
router.put('/cancel-booking/:id', authUser, cancelBooking);

export default router;
