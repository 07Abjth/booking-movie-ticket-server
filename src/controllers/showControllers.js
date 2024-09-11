import Show from '../models/showModel.js';
import Theater from '../models/theaterModel.js';
import Movie from '../models/movieModel.js';

// Create a new show
export const createShow = async (req, res) => {
  try {
    const { movieId, theaterId, showTime, price } = req.body;

    // Validate required fields
    if (!movieId || !theaterId || !showTime || !price) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if the user is a theater owner or admin
    const userRole = req.user.role;

    // If Theater Owner, ensure they own the theater
    if (userRole === 'theater_owner') {
      const theater = await Theater.findById(theaterId);
      if (!theater || theater.ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized: You do not own this theater.' });
      }
    }

  

    // Check if the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Check if the theater exists
    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }

    // Create the new show
    const newShow = await Show.create({
      movie: movieId,
      theater: theaterId,
      showTime,
      price
    });

    return res.status(201).json({ success: true, message: 'Show created successfully', show: newShow });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



// Fetch all shows
export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find().populate('movie').populate('theater');
    res.status(200).json({ success: true, data: shows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch shows by movie
export const getShowsByMovie = async (req, res) => {
  try {
    const shows = await Show.find({ movie: req.params.movieId }).populate('theater');
    res.status(200).json({ success: true, data: shows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch shows by theater
export const getShowsByTheater = async (req, res) => {
  try {
    const shows = await Show.find({ theater: req.params.theaterId }).populate('movie');
    res.status(200).json({ success: true, data: shows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// Update an existing show
export const updateShow = async (req, res) => {
  try {
    const { id } = req.params;
    const { showTime, price } = req.body;

    const updatedShow = await Show.findByIdAndUpdate(
      id,
      { showTime, price },
      { new: true }
    );

    if (!updatedShow) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    return res.status(200).json({ success: true, message: 'Show updated successfully', show: updatedShow });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete an existing show
export const deleteShow = async (req, res) => {
  try {
    const { id } = req.params;

    const show = await Show.findByIdAndDelete(id);

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    return res.status(200).json({ success: true, message: 'Show deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

 