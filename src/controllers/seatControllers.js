
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
    res.status(201).json({ success: true, data: createdSeats });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
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


 

// export const getSeatLayout = async (req, res) => {
//   try {
//     const { theaterId } = req.params; // Ensure you're using the right parameter

//     if (!theaterId) {
//       return res.status(400).json({ message: 'Theater ID is required' });
//     }

//     const theater = await Theater.findById(theaterId).populate('showtimes');
    
//     if (!theater) {
//       return res.status(404).json({ message: 'Theater not found' });
//     }

//     const seatLayout = theater.screens.find(screen => 
//       screen.showtimes.some(show => show._id.toString() === req.body.showId)
//     )?.seatLayout;

//     if (!seatLayout) {
//       return res.status(404).json({ message: 'Seat layout not found' });
//     }

//     res.status(200).json(seatLayout);
//   } catch (error) {
//     console.error('Error fetching seat layout:', error);
//     res.status(500).json({ error: 'Error fetching seat layout' });
//   }
// };



 

export const fetchSeatLayout = async (req, res) => {
  const { theaterId } = req.params;
  const { showId } = req.query; // Get showId from query parameters

  try {
    // Find the theater by ID
    const theater = await Theater.findById(theaterId).populate('screens.showtimes');

    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    // Find the specific screen associated with the show
    const screen = theater.screens.find(screen => 
      screen.showtimes.some(show => show._id.toString() === showId)
    );

    if (!screen) {
      return res.status(404).json({ message: 'Screen not found for this show' });
    }

    // Get the seat layout for the found screen
    const seatLayout = screen.seatLayout;

    if (!seatLayout) {
      return res.status(404).json({ message: 'Seat layout not found' });
    }

    // Fetch the seats for the specific show
    const seats = await Seat.find({ show: showId }).populate('theater');

    // Combine seat layout with availability
    const seatLayoutWithAvailability = seatLayout.map(row => {
      return {
        row,
        seats: seats.filter(seat => seat.row === row)
      };
    });

    res.status(200).json(seatLayoutWithAvailability);
  } catch (error) {
    console.error('Error fetching seat layout:', error);
    res.status(500).json({ error: 'Error fetching seat layout' });
  }
};
