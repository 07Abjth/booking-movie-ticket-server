import Seat from '../models/seatModel.js';

// Create seats for a show in bulk
export const createSeats = async (req, res) => {
  const { theater, show, seatRows, seatsPerRow, price } = req.body;

  try {
    const seats = [];

    // Loop to generate seats for each row and seat number
    for (let row = 0; row < seatRows; row++) {
      const rowLabel = String.fromCharCode(65 + row); // Converts 0 to 'A', 1 to 'B', etc.

      for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
        seats.push({
          theater,
          show,
          seatNumber: `${rowLabel}${seatNumber}`, // Example: 'A1', 'A2', 'B1', etc.
          status: 'available',
          price,
        });
      }
    }

    // Bulk insert seats into the database
    const createdSeats = await Seat.insertMany(seats);

    res.status(201).json({ success: true, data: createdSeats });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get available seats for a specific show
export const getSeatsByShow = async (req, res) => {
  try {
    // Fetch seats from the database where the show ID matches and status is 'available'
    const seats = await Seat.find({ show: req.params.showId, status: 'available' });

    // Respond with the retrieved seats
    res.json({ success: true, data: seats });
  } catch (error) {
    // Handle and respond to any errors
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const getSeatsByShow = async (req, res) => {
//   try {
//     console.log(`Fetching seats for show ID: ${req.params.showId}`);
//     const seats = await Seat.find({ show: req.params.showId, status: 'available' });
//     console.log(`Found seats: ${JSON.stringify(seats)}`);
//     res.json({ success: true, data: seats });
//   } catch (error) {
//     console.error(`Error fetching seats: ${error.message}`);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };




//Reserving seats
export const reserveSeats = async (req, res) => {
  try {
    const { seats } = req.body;

    // Validate input
    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid seat IDs provided.' });
    }

    // Check if all seats are available
    const availableSeats = await Seat.find({ _id: { $in: seats }, status: 'available' });
    if (availableSeats.length !== seats.length) {
      return res.status(400).json({ success: false, message: 'Some seats are not available' });
    }

    // Reserve seats
    const updatedSeats = await Seat.updateMany(
      { _id: { $in: seats }, status: 'available' },
      { status: 'reserved' }
    );

    if (updatedSeats.nModified === 0) {
      return res.status(400).json({ success: false, message: 'Seats could not be reserved' });
    }

    res.json({ success: true, message: 'Seats reserved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete seats
export const deleteSeats = async (req, res) => {
  try {
    const { seatIds } = req.body;

    // Validate input
    if (!Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid seat IDs provided.' });
    }

    // Delete seats
    const result = await Seat.deleteMany({ _id: { $in: seatIds } });

    if (result.deletedCount === 0) {
      return res.status(400).json({ success: false, message: 'No seats found to delete' });
    }

    res.json({ success: true, message: `${result.deletedCount} seats deleted successfully` });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
