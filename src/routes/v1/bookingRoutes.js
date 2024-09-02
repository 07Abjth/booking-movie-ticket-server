import express from 'express';
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
} from '../../controllers/bookingControllers.js';
import { authTheaterOwner } from '../../middleware/authTheaterOwner.js';
import {authAdmin} from '../../middleware/authAdmin.js'
import {authUser} from '../../middleware/authUser.js'


const router = express.Router();

// Route to create a new booking
router.post('/create',  createBooking);

// Route to get all bookings for a specific user
router.get('/get-userBookings/:id', authUser, getUserBookings);

// Route to get all bookings all users
router.get('/get-allBookings', authAdmin, getAllBookings);

// Route to get a specific booking by ID
router.get('/get-booking-by-id/:id', getBookingById);

// Route to cancel a booking
router.put('/cancel-booking/:id/', cancelBooking);

export default router;
