// import SeatLayoutModel from '../../models/SeatLayoutModel.js';

// // Create a new seat layout
// export const createSeatLayout = async (req, res) => {
//   try {
//     const { theaterId, showId, layout, seats } = req.body;
//     const newSeatLayout = new SeatLayoutModel({ theaterId, showId, layout, seats });
//     await newSeatLayout.save();
//     res.status(201).json(newSeatLayout);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get seat layout by theaterId and showId
// export const getSeatLayout = async (req, res) => {
//   try {
//     const { theaterId, showId } = req.params;
//     const seatLayout = await SeatLayoutModel.findOne({ theaterId, showId }).populate('seats');
//     if (!seatLayout) {
//       return res.status(404).json({ error: 'Seat layout not found' });
//     }
//     res.status(200).json(seatLayout);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update a seat layout
// export const updateSeatLayout = async (req, res) => {
//   try {
//     const { theaterId, showId } = req.params;
//     const updatedLayout = await SeatLayoutModel.findOneAndUpdate(
//       { theaterId, showId },
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedLayout) {
//       return res.status(404).json({ error: 'Seat layout not found' });
//     }
//     res.status(200).json(updatedLayout);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete a seat layout
// export const deleteSeatLayout = async (req, res) => {
//   try {
//     const { theaterId, showId } = req.params;
//     const deletedLayout = await SeatLayoutModel.findOneAndDelete({ theaterId, showId });
//     if (!deletedLayout) {
//       return res.status(404).json({ error: 'Seat layout not found' });
//     }
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// //fetchSeatLayout
// export const fetchSeatLayout = async (req, res) => {
//     const { theaterId, showId } = req.params;
  
//     try {
//       const seats = await Seat.find({ theater: theaterId, show: showId });
//       if (!seats.length) {
//         return res.status(404).json({ error: 'Seats not found' });
//       }
  
//       const layout = createSeatLayout(seats); // Organizes seats into rows
  
//       return res.json({ seats, layout });
//     } catch (error) {
//       console.error('Error fetching seat layout:', error);
//       return res.status(500).json({ error: 'Failed to fetch seat layout' });
//     }
//   };
  
//   // Helper function to organize seats into rows
//   const createSeatLayout = (seats) => {
//     const layout = {};
  
//     seats.forEach((seat) => {
//       const row = seat.seatNumber[0];  // Extract the row from seat number (e.g., 'A' from 'A1')
//       if (!layout[row]) layout[row] = [];
//       layout[row].push(seat);  // Push the seat into the corresponding row
//     });
  
//     return layout;
//   };
  

import SeatLayoutModel from '../../models/SeatLayoutModel.js';
import Seat from '../../models/seatModel.js'; // Import the Seat model

// Create a new seat layout
export const createSeatLayout = async (req, res) => {
  try {
    const { theaterId, showId, layout, seats } = req.body;
    const newSeatLayout = new SeatLayoutModel({ theaterId, showId, layout, seats });
    await newSeatLayout.save();
    res.status(201).json(newSeatLayout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get seat layout by theaterId and showId
export const getSeatLayout = async (req, res) => {
  try {
    const { theaterId, showId } = req.params;
    const seatLayout = await SeatLayoutModel.findOne({ theaterId, showId }).populate('seats');
    if (!seatLayout) {
      return res.status(404).json({ error: 'Seat layout not found' });
    }
    res.status(200).json(seatLayout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a seat layout
export const updateSeatLayout = async (req, res) => {
  try {
    const { theaterId, showId } = req.params;
    const updatedLayout = await SeatLayoutModel.findOneAndUpdate(
      { theaterId, showId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedLayout) {
      return res.status(404).json({ error: 'Seat layout not found' });
    }
    res.status(200).json(updatedLayout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a seat layout
export const deleteSeatLayout = async (req, res) => {
  try {
    const { theaterId, showId } = req.params;
    const deletedLayout = await SeatLayoutModel.findOneAndDelete({ theaterId, showId });
    if (!deletedLayout) {
      return res.status(404).json({ error: 'Seat layout not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch seat layout with seats
export const fetchSeatLayout = async (req, res) => {
  const { theaterId, showId } = req.params;

  try {
    const seats = await Seat.find({ theater: theaterId, show: showId });
    if (!seats.length) {
      return res.status(404).json({ error: 'Seats not found' });
    }

    const layout = createSeatLayout(seats); // Organizes seats into rows

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
    const row = seat.seatNumber[0]; // Extract the row from seat number (e.g., 'A' from 'A1')
    if (!layout[row]) layout[row] = [];
    layout[row].push(seat); // Push the seat into the corresponding row
  });

  return layout;
};
