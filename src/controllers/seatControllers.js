
import Seat from '../models/seatModel.js';
import Theater from '../models/theaterModel.js';


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
   return  res.status(201).json({ success: true, data: createdSeats });
  } catch (error) {
   return  res.status(400).json({ success: false, message: error.message });
  }
};




// import Seat from '../models/seatModel.js';
// import Theater from '../models/theaterModel.js';

// // Create seats for a show in bulk
// export const createSeats = async (req, res) => {
//   const { theater, show, seatRows, seatsPerRow, price } = req.body;

//   try {
//     const seats = [];
//     for (let row = 0; row < seatRows; row++) {
//       const rowLabel = String.fromCharCode(65 + row);
//       for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
//         seats.push({
//           theater,
//           show,
//           seatNumber: `${rowLabel}${seatNumber}`,
//           price,
//         });
//       }
//     }

//     await Seat.insertMany(seats);
//     return res.status(201).json({ message: 'Seats created successfully' });
//   } catch (error) {
//     console.error('Error creating seats:', error);
//     return res.status(500).json({ error: 'Failed to create seats' });
//   }
// };

// Get seats for a show
export const getSeatsForShow = async (req, res) => {
  const { showId } = req.params;
  try {
    const seats = await Seat.find({ show: showId });
    res.status(200).json({ success: true, seats });
  } catch (error) {
    console.error('Error fetching seats:', error);
    return res.status(500).json({ error: 'Failed to fetch seats' });
  }
};

// Reserve seats
export const reserveSeats = async (req, res) => {
  const { seats } = req.body;

  try {
    const updatedSeats = await Seat.updateMany(
      { _id: { $in: seats }, status: 'available' },
      { $set: { status: 'booked' } }
    );

    if (updatedSeats.nModified === 0) {
      return res.status(400).json({ error: 'Seats are not available for booking' });
    }

    return res.json({ message: 'Seats booked successfully' });
  } catch (error) {
    console.error('Error reserving seats:', error);
    return res.status(500).json({ error: 'Failed to reserve seats' });
  }
};

// Fetch seat layout for a specific theater and show
export const fetchSeatLayout = async (req, res) => {
  const { theaterId } = req.params;
  const { showId } = req.query;

  try {
    const seats = await Seat.find({ theater: theaterId, show: showId });
    if (!seats) {
      return res.status(404).json({ error: 'Seats not found' });
    }

    const layout = createSeatLayout(seats); // A helper function to organize seats by rows

    return res.json({ seats, layout });
  } catch (error) {
    console.error('Error fetching seat layout:', error);
    return res.status(500).json({ error: 'Failed to fetch seat layout' });
  }
};

// Helper function to organize seats into rows
const createSeatLayout = (seats) => {
  const layout = {};

  seats.forEach((seat) => {
    const row = seat.seatNumber[0];
    if (!layout[row]) layout[row] = [];
    layout[row].push(seat._id);
  });

  return Object.values(layout);
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


