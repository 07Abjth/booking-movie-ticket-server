import Show from '../models/showModel.js';

// Get all shows
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find().populate('movie').populate('theater');
    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific show by ID
export const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate('movie').populate('theater');
    if (show) {
      res.json(show);
    } else {
      res.status(404).json({ message: 'Show not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get shows for a specific movie
export const getShowsByMovie = async (req, res) => {
  try {
    const shows = await Show.find({ movie: req.params.movieId }).populate('theater');
    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get shows for a specific theater
export const getShowsByTheater = async (req, res) => {
  try {
    const shows = await Show.find({ theater: req.params.theaterId }).populate('movie');
    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
