import Booking from '../models/bookingModel.js';
import Seat from '../models/seatModel.js';
import mongoose from 'mongoose';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { user, show, seats, totalPrice } = req.body;

    // Check if seats are available
    const availableSeats = await Seat.find({ _id: { $in: seats }, status: 'available' });
    if (availableSeats.length !== seats.length) {
      return res.status(400).json({ message: 'Some seats are not available' });
    }

    // Create booking
    const booking = new Booking({ user, show, seats, totalPrice });
    await booking.save();

    // Update seats to reserved
    await Seat.updateMany({ _id: { $in: seats } }, { status: 'reserved' });

    res.status(201).json(booking);
    console.log('Creating booking with user ID:', userId);


  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all bookings for the authenticated user (Authenticated User)
export const getUserBookings = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Requested userId:', id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    const bookings = await Booking.find({ user: id })
                                  .populate('show', 'movie theater showTime price') // Adjust as needed
                                  .populate('seats', 'seatNumber status price') // Adjust as needed
                                  .select('user show seats totalPrice paymentStatus'); // Adjust as needed

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user.' });
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Get all bookings of all users(Admin role)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('user').populate('show').populate('seats');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('show').populate('seats');
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

    // Update seats to available
    await Seat.updateMany({ _id: { $in: booking.seats } }, { status: 'available' });

    // Delete booking
    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
