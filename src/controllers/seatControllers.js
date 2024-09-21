
import Seat from '../models/seatModel.js';

// Create seats for a show in bulk
export const createSeats = async (req, res) => {
  const { theater, show, seatRows, seatsPerRow, price } = req.body;

  try {
    const seats = [];
    for (let row = 0; row < seatRows; row++) {
      const rowLabel = String.fromCharCode(65 + row); // Generates 'A', 'B', etc.
      for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
        seats.push({
          theater,
          show,
          seatNumber: `${rowLabel}${seatNumber}`,
          status: 'available',
          price,
        });
      }
    }

    const createdSeats = await Seat.insertMany(seats);
    res.status(201).json({ success: true, data: createdSeats });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get available seats for a specific show
export const getSeatsByShow = async (req, res) => {
  try {
    const seats = await Seat.find({ show: req.params.showId, status: 'available' });
    res.json({ success: true, data: seats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reserve seats
export const reserveSeats = async (req, res) => {
  const { seats } = req.body;

  try {
    const availableSeats = await Seat.find({ _id: { $in: seats }, status: 'available' });
    if (availableSeats.length !== seats.length) {
      return res.status(400).json({ success: false, message: 'Some seats are unavailable' });
    }

    await Seat.updateMany({ _id: { $in: seats }, status: 'available' }, { status: 'reserved' });
    res.json({ success: true, message: 'Seats reserved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete seats
export const deleteSeats = async (req, res) => {
  const { seatIds } = req.body;

  try {
    const result = await Seat.deleteMany({ _id: { $in: seatIds } });
    if (result.deletedCount === 0) {
      return res.status(400).json({ success: false, message: 'No seats found to delete' });
    }
    res.json({ success: true, message: `${result.deletedCount} seats deleted successfully` });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const getSeatsByShowId = async (req, res) => {
  const { showId } = req.params;
  try {
    const seats = await Seat.find({ showId });
    if (!seats.length) {
      return res.status(404).json({ message: "No seats found for this show." });
    }
    res.status(200).json({ data: seats });
  } catch (error) {
    console.error("Error fetching seats:", error);
    res.status(500).json({ error: "Error fetching seats for this show" });
  }
};