import Seat from '../models/seatModel.js';

// Get available seats for a specific show
export const getSeatsByShow = async (req, res) => {
  try {
    // Find available seats for the given show
    const seats = await Seat.find({ show: req.params.showId, status: 'available' });
    res.json({ success: true, data: seats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reserve seats
export const reserveSeats = async (req, res) => {
  try {
    const { seats } = req.body;

    // Reserve seats by updating their status
    const updatedSeats = await Seat.updateMany(
      { _id: { $in: seats }, status: 'available' }, // Ensure only available seats are reserved
      { status: 'reserved' }
    );

    if (updatedSeats.nModified === 0) {
      return res.status(400).json({ success: false, message: 'Seats already reserved or unavailable' });
    }

    res.json({ success: true, message: 'Seats reserved successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
