import Seat from '../models/seatModel.js';

// Get available seats for a specific show
export const getSeatsByShow = async (req, res) => {
  try {
    const seats = await Seat.find({ show: req.params.showId });
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reserve seats
export const reserveSeats = async (req, res) => {
  try {
    const { seats } = req.body;
    await Seat.updateMany({ _id: { $in: seats } }, { status: 'reserved' });
    res.json({ message: 'Seats reserved successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
