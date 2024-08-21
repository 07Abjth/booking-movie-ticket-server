import Show from '../models/showModel.js';
import Theater from '../models/theaterModel.js';
import Movie from '../models/movieModel.js';

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

    // If Admin, no ownership check is necessary
    if (userRole === 'admin') {
      // Admins bypass theater ownership check, can create shows for any theater
    }

    // Check if the movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
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

export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find().populate('movie').populate('theater');
    return res.status(200).json({ success: true, shows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
