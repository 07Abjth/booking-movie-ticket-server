import Show from '../models/showModel.js';
import Theater from '../models/theaterModel.js';
import Movie from '../models/movieModel.js';
import ShowSeatAvailability from '../models/ShowSeatAvailabilityModel.js';
import Seat  from '../models/seatModel.js'


// Create a new show
export const createShow = async (req, res) => {
  try {
    const { movieId, theaterId, date, time, price } = req.body;

    // Validate required fields
    if (!movieId || !theaterId || !date || !time || !price) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Validate movie and theater
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }

    // Ensure date is a Date object
    const showDate = new Date(date);

    // Create show
    const newShow = await Show.create({
      movie: movieId,
      theater: theaterId,
      date: showDate,
      time,
      price
    });

    res.status(201).json({ success: true, message: 'Show created successfully', show: newShow });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



// // Create availability for seats in a show
// export const createSeatAvailability = async (req, res) => {
//   const { showId, seats, price } = req.body; // Expecting an array of seat IDs
  
//   try {
//     const availability = seats.map(seat => ({
//       show: showId,
//       seat,
//       status: 'available', // Set initial status
//       price, // Price for the show
//     }));

//     await ShowSeatAvailability.insertMany(availability);
//     return res.status(201).json({ message: 'Seat availability created successfully' });
//   } catch (error) {
//     console.error('Error creating seat availability:', error);
//     return res.status(500).json({ error: 'Failed to create seat availability' });
//   }
// };


  

// Fetch seat availability for a specific show
export const fetchSeatAvailability = async (req, res) => {
  const { showId } = req.params;

  try {
    const availability = await ShowSeatAvailability.find({ show: showId })
      .populate('seat') // Optional: populate seat details
      .exec();

    if (!availability.length) {
      return res.status(404).json({ error: 'No seat availability found' });
    }

    return res.json(availability);
  } catch (error) {
    console.error('Error fetching seat availability:', error);
    return res.status(500).json({ error: 'Failed to fetch seat availability' });
  }
};



// Create availability for seats in a show
export const createSeatAvailability = async (req, res) => {
  const { showId, seats, price } = req.body; // Expecting an array of seat IDs
  
  try {
    const availability = seats.map(seat => ({
      show: showId,
      seat,
      status: 'available', // Set initial status
      price, // Price for the show
    }));

    await ShowSeatAvailability.insertMany(availability);
    return res.status(201).json({ message: 'Seat availability created successfully' });
  } catch (error) {
    console.error('Error creating seat availability:', error);
    return res.status(500).json({ error: 'Failed to create seat availability' });
  }
};


// //Create multiple shows
// export const createMultipleShows = async (req, res) => {
//   try {
//     const { movieId, theaterId, dates, times, price } = req.body;

//     // Validate input
//     if (!movieId || !theaterId || !Array.isArray(dates) || !Array.isArray(times) || typeof price !== 'number') {
//       return res.status(400).json({ success: false, message: 'Invalid input data. Ensure all fields are correct.' });
//     }

//     // Array to store created shows
//     const createdShows = [];



    // // Seat configuration: number of seats per row
    // const seatConfig = [12, 10, 9, 8, 7, 7, 7, 7, 7, ]; // Total 10 rows

//     // Loop through each date and time combination
//     for (const date of dates) {
//       // Ensure date is a valid Date object
//       const parsedDate = new Date(date);
//       if (isNaN(parsedDate.getTime())) {
//         return res.status(400).json({ success: false, message: `Invalid date format: ${date}` });
//       }

//       for (const time of times) {
//         // Create each show with the specified movie, theater, date, time, and price
//         const show = new Show({
//           movie: movieId,
//           theater: theaterId,
//           date: parsedDate,
//           time, // Time is already a string
//           price
//         });

//         // Save the show to the database
//         try {
//           const savedShow = await show.save();
//           createdShows.push(savedShow);
//         } catch (saveError) {
//           console.error('Error saving show:', saveError);
//           return res.status(500).json({ success: false, message: 'Error saving show to database' });
//         }
//       }
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Shows created successfully',
//       shows: createdShows
//     });
//   } catch (error) {
//     console.error('Error creating multiple shows:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };



// // Create multiple shows
// export const createMultipleShows = async (req, res) => {
//   try {
//     const { movieId, theaterId, dates, times, price } = req.body;

//     // Validate input
//     if (!movieId || !theaterId || !Array.isArray(dates) || !Array.isArray(times) || typeof price !== 'number') {
//       return res.status(400).json({ success: false, message: 'Invalid input data. Ensure all fields are correct.' });
//     }

//     // Array to store created shows
//     const createdShows = [];

//     // Seat configuration: number of seats per row
//     const seatConfig = [12, 10, 9, 8, 7, 7, 7, 7, 7, ]; // Total 10 rows

//     // Loop through each date and time combination
//     for (const date of dates) {
//       // Ensure date is a valid Date object
//       const parsedDate = new Date(date);
//       if (isNaN(parsedDate.getTime())) {
//         return res.status(400).json({ success: false, message: `Invalid date format: ${date}` });
//       }

//       for (const time of times) {
//         // Create each show with the specified movie, theater, date, time, and price
//         const show = new Show({
//           movie: movieId,
//           theater: theaterId,
//           date: parsedDate,
//           time, // Time is already a string
//           price
//         });

//         // Save the show to the database
//         try {
//           const savedShow = await show.save();
//           createdShows.push(savedShow);

//           // Create seats for the saved show according to the defined configuration
//           for (let rowIndex = 0; rowIndex < seatConfig.length; rowIndex++) {
//             const seatCountInRow = seatConfig[rowIndex];

//             for (let seatNumber = 1; seatNumber <= seatCountInRow; seatNumber++) {
//               const seat = new Seat({
//                 theater: theaterId,
//                 show: savedShow._id,
//                 seatNumber: `R${rowIndex + 1}-S${seatNumber}`, // Unique seat identifier
//                 status: 'available', // or 'booked' based on your logic
//                 price
//               });

//               // Save the seat to the database
//               await seat.save();
//             }
//           }
//         } catch (saveError) {
//           console.error('Error saving show or seats:', saveError);
//           return res.status(500).json({ success: false, message: 'Error saving show or seats to database' });
//         }
//       }
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Shows and seats created successfully',
//       shows: createdShows
//     });
//   } catch (error) {
//     console.error('Error creating multiple shows:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };



// // Create multiple shows
// export const createMultipleShows = async (req, res) => {
//   try {
//     const { movieId, theaterId, dates, times, price } = req.body;

//     // Validate input
//     if (!movieId || !theaterId || !Array.isArray(dates) || !Array.isArray(times) || typeof price !== 'number') {
//       return res.status(400).json({ success: false, message: 'Invalid input data. Ensure all fields are correct.' });
//     }

//     const createdShows = [];
//     const seatConfig = [12, 10, 9, 8, 7, 7, 7, 7, 7, 6]; // Total 10 rows

//     for (const date of dates) {
//       const parsedDate = new Date(date);
//       if (isNaN(parsedDate.getTime())) {
//         return res.status(400).json({ success: false, message: `Invalid date format: ${date}` });
//       }

//       for (const time of times) {
//         const show = new Show({
//           movie: movieId,
//           theater: theaterId,
//           date: parsedDate,
//           time,
//           price
//         });

//         try {
//           const savedShow = await show.save();
//           createdShows.push(savedShow);

//           // Create seats for this show
//           for (let rowIndex = 0; rowIndex < seatConfig.length; rowIndex++) {
//             const seatCountInRow = seatConfig[rowIndex];

//             for (let seatNumber = 1; seatNumber <= seatCountInRow; seatNumber++) {
//               // Ensure seat number is unique and trimmed
//               const uniqueSeatNumber = `R${rowIndex + 1}-S${seatNumber}`.trim();

//               try {
//                 // Check if seat already exists for the show
//                 const existingSeat = await Seat.findOne({ seatNumber: uniqueSeatNumber, show: savedShow._id });

//                 if (!existingSeat) {
//                   const seat = new Seat({
//                     theater: theaterId,
//                     show: savedShow._id,
//                     seatNumber: uniqueSeatNumber,
//                     status: 'available',
//                     price
//                   });

//                   await seat.save(); // Save the seat
//                 }
//               } catch (seatError) {
//                 console.error(`Error saving seat ${uniqueSeatNumber}:`, seatError);
//               }
//             }
//           }
//         } catch (showError) {
//           console.error('Error saving show or seats:', showError);
//           return res.status(500).json({ success: false, message: 'Error saving show or seats to database' });
//         }
//       }
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Shows and seats created successfully',
//       shows: createdShows
//     });
//   } catch (error) {
//     console.error('Error creating multiple shows:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };







export const createMultipleShows = async (req, res) => {
  try {
    const { movieId, theaterId, dates, times, price } = req.body;

    // Validate input
    if (!movieId || !theaterId || !Array.isArray(dates) || !Array.isArray(times) || typeof price !== 'number') {
      return res.status(400).json({ success: false, message: 'Invalid input data. Ensure all fields are correct.' });
    }

    const createdShows = [];
    const seatConfig = [12, 10, 9, 8, 7, 7, 7, 7, 7, 6]; // Total 10 rows
    const seatsToCreate = []; // Array to batch seat creation

    for (const date of dates) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ success: false, message: `Invalid date format: ${date}` });
      }

      for (const time of times) {
        const show = new Show({
          movie: movieId,
          theater: theaterId,
          date: parsedDate,
          time,
          price
        });

        try {
          const savedShow = await show.save();
          createdShows.push(savedShow);

          // Create seats for this show and push them to the array
          for (let rowIndex = 0; rowIndex < seatConfig.length; rowIndex++) {
            const seatCountInRow = seatConfig[rowIndex];

            for (let seatNumber = 1; seatNumber <= seatCountInRow; seatNumber++) {
              const uniqueSeatNumber = `R${rowIndex + 1}-S${seatNumber}`.trim();
              seatsToCreate.push({
                theater: theaterId,
                show: savedShow._id,
                seatNumber: uniqueSeatNumber,
                status: 'available',
                price
              });
            }
          }
        } catch (showError) {
          console.error('Error saving show:', showError);
          return res.status(500).json({ success: false, message: 'Error saving show to database' });
        }
      }
    }

    // Batch create seats
    await Seat.insertMany(seatsToCreate);

    res.status(201).json({
      success: true,
      message: 'Shows and seats created successfully',
      shows: createdShows
    });
  } catch (error) {
    console.error('Error creating multiple shows:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};








// Get show details by ID
export const getShowDetailsById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate('movie').populate('theater');
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }
    res.status(200).json({ success: true, data: show });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get shows by movie
export const getShowsByMovie = async (req, res) => {
  try {
    const shows = await Show.find({ movie: req.params.movieId }).populate('theater');
    res.status(200).json({ success: true, data: shows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get shows by theater
export const getShowsByTheater = async (req, res) => {
  try {
    const shows = await Show.find({ theater: req.params.theaterId }).populate('movie');
    res.status(200).json({ success: true, data: shows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update show
export const updateShow = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, price } = req.body; // Use specific fields for the update

    // Prepare update data
    const updateData = {};
    if (date) updateData.date = new Date(date); // Ensure date is a Date object
    if (time) updateData.time = time;
    if (price) updateData.price = price;

    // Find and update the show document
    const updatedShow = await Show.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedShow) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    res.status(200).json({ success: true, message: 'Show updated successfully', show: updatedShow });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete show
export const deleteShow = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await Show.findByIdAndDelete(id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    res.status(200).json({ success: true, message: 'Show deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// // Get shows by movie ID
// export const getShowsByMovieId = async (req, res) => {
//   try {
//     const { movieId } = req.params;
//     const shows = await Show.find({ movie: movieId }).populate('theater');
//     if (!shows || shows.length === 0) {
//       return res.status(404).json({ success: false, message: 'No shows found for this movie' });
//     }
//     res.status(200).json({ success: true, data: shows });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };


// // Fetch shows by movieId
// export const getShowsByMovieId = async (req, res) => {
//   const { movieId } = req.params;

//   try {
//     const shows = await Show.find({ movieId });
//     if (!shows || shows.length === 0) {
//       return res.status(404).json({ error: 'No shows found for this movie.' });
//     }
//     return res.status(200).json(shows);
//   } catch (error) {
//     return res.status(500).json({ error: 'An error occurred while fetching shows.' });
//   }
// };

export const getShowsByMovieId = async (req, res) => {
  const { movieId } = req.params;
  console.log('Fetching shows for movieId:', movieId); // Debugging log
  try {
    const shows = await Show.find({ movie: movieId });
    console.log('Shows found:', shows); // Debugging log
    if (!shows.length) {
      // Return an empty array instead of a 404 error
      return res.status(200).json([]); // No shows but not an error
    }
    res.status(200).json(shows);
  } catch (error) {
    console.error('Error fetching shows:', error);
    res.status(500).json({ error: 'An error occurred while fetching shows.' });
  }
};

// export const getTheaterShowTimesForMovieId = async (movieId) => {
//   try {
//     const shows = await Show.aggregate([
//       { $match: { movie: mongoose.Types.ObjectId(movieId) } },
//       {
//         $group: {
//           _id: "$theater",
//           times: { $push: "$time" },
//           theaterDetails: { $first: "$theater" } // Adjust if you need specific details
//         }
//       }
//     ]).populate('theaterDetails'); // Populate if you have a reference in the schema

//     return shows;
//   } catch (error) {
//     throw new Error('Error fetching showtimes');
//   }
// };


// GetShowTimesByTheaterId
 
export const getShowTimesByTheaterId = async (req, res) => {
  try {
    const { theaterId } = req.params;
    const showTimes = await Show.find({ theaterId }).populate('movieId');
    res.status(200).json(showTimes);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching showtimes.' });
  }
};
