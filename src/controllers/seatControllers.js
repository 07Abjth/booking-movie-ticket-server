
import Seat from '../models/seatModel.js';
import Theater from '../models/theaterModel.js';
import mongoose from 'mongoose';
import ShowSeat from '../models/showSeatModel.js'
 

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


// Get seats by theater ID

export const getSeatsByTheaterId = async (req, res) => {
    const { theaterId } = req.params;

    // Check if the theaterId is valid
    if (!mongoose.Types.ObjectId.isValid(theaterId)) {
        return res.status(400).json({ success: false, message: 'Invalid theater ID' });
    }

    try {
        const seats = await Seat.find({ theater: theaterId });

        if (!seats || seats.length === 0) {
            return res.status(404).json({ success: false, message: 'No seats found for this theater' });
        }

        return res.json({ success: true, seats });
    } catch (error) {
        console.error("Error fetching seats:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};



 


// export const getSeatPricesByTheater = async (req, res) => {
//   const { theaterId } = req.params;

//   try {
//     // Find the theater by the provided theaterId and populate seats
//     const theater = await Theater.findById(theaterId).populate('seats');

//     if (!theater) {
//       return res.status(404).json({ success: false, message: 'Theater not found' });
//     }

//     // Map through the seats to extract seat number and price
//     const seatPrices = theater.seats.map(seat => ({
//       seatId: seat._id,
//       price: seat.price,
//       seatNumber: seat.seatNumber,
//     }));

//     return res.status(200).json({ success: true, seatPrices });
//   } catch (error) {
//     console.error('Error fetching seat prices:', error);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// };



 
export const getSeatPricesByTheater = async (req, res) => {
  const { theaterId } = req.params;

  try {
      const theater = await Theater.findById(theaterId).populate('seats');

      if (!theater || !theater.seats || theater.seats.length === 0) {
          return res.status(404).json({ success: false, message: 'No seats found for this theater' });
      }

      const seatPrices = theater.seats.map(seat => ({
          seatId: seat._id,
          price: seat.price,
          seatNumber: seat.seatNumber,
      }));

      return res.status(200).json({ success: true, seatPrices });
  } catch (error) {
      console.error('Error fetching seat prices:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
  }
};



export const getSeatPrices = async (req, res) => {
  try {
      const { seatId } = req.params;
      // Check if seatId is valid (not undefined or null)
      if (!seatId) {
          return res.status(400).json({ success: false, message: "Seat ID is required." });
      }

      // Fetch the seat price from the ShowSeat model
      const showSeat = await ShowSeat.findOne({ seat: seatId }); // Adjust field names if necessary
      if (!showSeat) {
          return res.status(404).json({ success: false, message: "Seat not found" });
      }

      const seatPrice = showSeat.price; // Adjust if your ShowSeat model has a different field for price
      res.status(200).json({ success: true, price: seatPrice });
  } catch (error) {
      console.error("Error fetching seat price:", error);
      res.status(500).json({ success: false, message: "Server error fetching seat price" });
  }
};




export const getSeatPricesBySeatNumber = async (req, res) => {
  try {
      const { seatId: seatNumber } = req.params; // Get the seatNumber from the request parameters

      console.log('Fetching price for seatNumber:', seatNumber); // Log the seatNumber for debugging

      // Find the seat by its seatNumber in the Seat collection
      const seatInfo = await Seat.findOne({ seatNumber });

      if (!seatInfo) {
          console.log(`Seat not found for seatNumber: ${seatNumber}`);
          return res.status(404).json({ success: false, message: 'Seat not found' });
      }

      console.log(`Seat found: ${seatInfo}`); // Log seat info

      // Find the corresponding ShowSeat entry based on the seat ID from the Seat model
      const showSeatInfo = await ShowSeat.findOne({ seat: seatInfo._id });

      if (!showSeatInfo) {
          console.log(`ShowSeat not found for seat: ${seatInfo._id}`);
          return res.status(404).json({ success: false, message: 'Seat not found for the show' });
      }

      console.log(`ShowSeat found: ${showSeatInfo}`); // Log show seat info

      // Return the price from ShowSeat
      return res.status(200).json({ success: true, price: showSeatInfo.price });
  } catch (error) {
      console.error('Error fetching seat price:', error); // Log the error for debugging
      return res.status(500).json({ success: false, message: 'Server error fetching seat price' });
  }
};





export const getSeatPricesForShow = async (req, res) => {
  const { showId } = req.params;

  try {
      // Log the incoming showId
      console.log("Fetching seat prices for showId:", showId);

      // Fetch ShowSeat records for the specified show and populate seat data if needed
      const showSeats = await ShowSeat.find({ show: showId }).populate('seat');

      // If no show seats found, respond with an appropriate message
      if (!showSeats || showSeats.length === 0) {
          return res.status(404).json({ message: 'No seats found for this show.' });
      }

      // Create an array of seat prices
      const seatsWithPrices = showSeats.map(showSeat => ({
          seatId: showSeat.seat._id.toString(), // Ensure you are getting the correct seat reference
          price: showSeat.price, // Get the price directly from ShowSeat
      }));

      // Respond with the seat prices
      return res.status(200).json({ seats: seatsWithPrices });
  } catch (error) {
      console.error("Error fetching seat prices for showId:", showId, error);
      return res.status(500).json({ message: 'Server error while fetching seat prices.', error: error.message });
  }
};




export const getSeatPriceByShowSeatId = async (req, res) => {
  const { showSeatId } = req.params;

  try {
    // Fetch ShowSeat by its ID
    const showSeat = await ShowSeat.findById(showSeatId);

    // If the ShowSeat is not found, return a 404
    if (!showSeat) {
      return res.status(404).json({ message: 'ShowSeat not found.' });
    }

    // Return the seat price
    return res.status(200).json({
      seatId: showSeat.seat.toString(),
      price: showSeat.price,
      status: showSeat.status,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while fetching seat price.', error: error.message });
  }
};


 

 // Get seat details by IDs
export const getSeatDetailsByIds = async (req, res) => {
  const seatIds = req.body.seatIds; // Expect an array of seat IDs in the request body

  try {
      const seats = await Seat.find({ _id: { $in: seatIds } });
      if (!seats.length) {
          return res.status(404).send({ error: 'No seats found' });
      }
      res.json(seats);
  } catch (error) {
      console.error('Error retrieving seat details:', error.message);
      res.status(500).send({ error: 'Internal Server Error' });
  }
};
