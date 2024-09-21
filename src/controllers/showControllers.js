import Show from '../models/showModel.js';
import Theater from '../models/theaterModel.js';
import Movie from '../models/movieModel.js';

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


  
//Create multiple shows
export const createMultipleShows = async (req, res) => {
  try {
    const { movieId, theaterId, dates, times, price } = req.body;

    // Validate input
    if (!movieId || !theaterId || !Array.isArray(dates) || !Array.isArray(times) || typeof price !== 'number') {
      return res.status(400).json({ success: false, message: 'Invalid input data. Ensure all fields are correct.' });
    }

    // Array to store created shows
    const createdShows = [];

    // Loop through each date and time combination
    for (const date of dates) {
      // Ensure date is a valid Date object
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ success: false, message: `Invalid date format: ${date}` });
      }

      for (const time of times) {
        // Create each show with the specified movie, theater, date, time, and price
        const show = new Show({
          movie: movieId,
          theater: theaterId,
          date: parsedDate,
          time, // Time is already a string
          price
        });

        // Save the show to the database
        try {
          const savedShow = await show.save();
          createdShows.push(savedShow);
        } catch (saveError) {
          console.error('Error saving show:', saveError);
          return res.status(500).json({ success: false, message: 'Error saving show to database' });
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Shows created successfully',
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
