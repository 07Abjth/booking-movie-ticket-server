import Show from '../models/showModel.js';
import Theater from '../models/theaterModel.js';
import Movie from '../models/movieModel.js';
import ShowSeat from '../models/showSeatModel.js';
import Seat from '../models/seatModel.js';


//Create show
export const createShowOrMultipleShows = async (req, res) => {
  try {
    const { movieId, theaterId, screenNumber, startDate, endDate, showTimes, price } = req.body;

    // Validate theater existence
    const theater = await Theater.findById(theaterId).populate('screens');
    if (!theater) {
      return res.status(404).json({ success: false, message: "Theater not found" });
    }

    // Validate screen existence
    const screen = theater.screens.find(s => s.screenNumber === screenNumber);
    if (!screen) {
      return res.status(404).json({ success: false, message: "Screen not found in this theater" });
    }

    // Fetch existing seats for this theater and screen
    const seats = await Seat.find({ theater: theaterId, screen: screen._id });
    if (!seats.length) {
      return res.status(404).json({ success: false, message: 'No seats found for this theater.' });
    }

    const createdShows = [];

    // Loop through the showTimes array to create shows for each day and time
    for (const { day, times } of showTimes) {
      for (const time of times) {
        const showDate = new Date(startDate);
        const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day);

        // Calculate the actual date for the show
        showDate.setDate(showDate.getDate() + ((dayIndex - showDate.getDay() + 7) % 7)); // Get the next occurrence of the specified day

        const show = new Show({
          movie: movieId,
          theater: theaterId,
          screenNumber,
          date: showDate, // Set the date field
          time: time,     // Set the time field
        });

        await show.save();

        // Create ShowSeat entries by linking existing seats to the show
        const showSeats = seats.map(seat => ({
          seat: seat._id,
          show: show._id,
          status: 'available',
          price: seat.type === 'Premium' ? price.premium || 200 :
                 seat.type === 'Luxury' ? price.luxury || 300 :
                 price.regular || 100,
        }));

        await ShowSeat.insertMany(showSeats);
        createdShows.push(show);
      }
    }

    res.status(201).json({ success: true, data: createdShows });
  } catch (error) {
    console.error("Error creating show(s):", error);
    res.status(500).json({ success: false, message: error.message });
  }
};




// Get show details by ID
export const getShowDetailsById = async (req, res) => {
    try {
        const show = await Show.findById(req.params.id).populate('movie').populate('theater');
        if (!show) {
            return res.status(404).json({ success: false, message: 'Show not found.' });
        }
        res.status(200).json({ success: true, data: show });
    } catch (error) {
        console.error('Error fetching show details:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// Get shows by movie ID
export const getShowsByMovie = async (req, res) => {
    try {
        const shows = await Show.find({ movie: req.params.movieId }).populate('theater');
        res.status(200).json({ success: true, data: shows });
    } catch (error) {
        console.error('Error fetching shows by movie:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// Get shows by theater ID
export const getShowsByTheater = async (req, res) => {
    try {
        const shows = await Show.find({ theater: req.params.theaterId }).populate('movie');
        res.status(200).json({ success: true, data: shows });
    } catch (error) {
        console.error('Error fetching shows by theater:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// Update show details
export const updateShow = async (req, res) => {
    try {
        const { date, time, price } = req.body;
        const { id } = req.params;

        // Validate and prepare update data
        const updateData = {};
        if (date) updateData.date = new Date(date);
        if (time) updateData.time = time;
        if (price) updateData.price = price;

        // Find and update the show
        const updatedShow = await Show.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedShow) {
            return res.status(404).json({ success: false, message: 'Show not found.' });
        }

        res.status(200).json({ success: true, message: 'Show updated successfully.', show: updatedShow });
    } catch (error) {
        console.error('Error updating show:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// Delete show
export const deleteShow = async (req, res) => {
    try {
        const { id } = req.params;
        const show = await Show.findByIdAndDelete(id);
        if (!show) {
            return res.status(404).json({ success: false, message: 'Show not found.' });
        }

        res.status(200).json({ success: true, message: 'Show deleted successfully.' });
    } catch (error) {
        console.error('Error deleting show:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};




// Function to get shows by movie ID
export const getShowsByMovieId = async (req, res) => {
  const { movieId } = req.params;

  try {
    // Fetch shows from your database using the movie ID
    const shows = await Show.find({ movie: movieId }); // Adjust based on your schema

    if (!shows || shows.length === 0) {
      return res.status(404).json({ message: 'No shows found for this movie.' });
    }

    return res.status(200).json(shows);
  } catch (error) {
    console.error('Error fetching shows by movie ID:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
