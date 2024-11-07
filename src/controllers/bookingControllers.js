import Booking from '../models/bookingModel.js';
import Seat from '../models/seatModel.js';
import mongoose from 'mongoose';

// Get all bookings for the authenticated user
export const getUserBookings = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    const bookings = await Booking.find({ user: id })
      .populate('movie', 'title')
      .populate('theater', 'name')
      .populate('showTime')
      .populate('selectedSeats', 'seatNumber status')
      .select('user movie theater showTime selectedSeats totalAmount paymentStatus createdAt');

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user.' });
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings of all users (Admin role)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('movie', 'title')
      .populate('theater', 'name')
      .populate('selectedSeats', 'seatNumber')
      .select('user movie theater showTime selectedSeats totalAmount paymentStatus createdAt');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie', 'title')
      .populate('theater', 'name')
      .populate('showTime')
      .populate('selectedSeats', 'seatNumber status');

    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update seats to available status
    await Seat.updateMany({ _id: { $in: booking.selectedSeats } }, { status: 'available' });

    // Delete booking
    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
