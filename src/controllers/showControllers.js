import Show from '../models/showModel.js';

// Get all shows
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find().populate('movie').populate('theater');
    res.status(200).json({ success: true, data: shows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific show by ID
export const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate('movie').populate('theater');
    if (show) {
      res.status(200).json({ success: true, data: show });
    } else {
      res.status(404).json({ success: false, message: 'Show not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get shows for a specific movie
export const getShowsByMovie = async (req, res) => {
  try {
    const shows = await Show.find({ movie: req.params.movieId }).populate('theater');
    res.status(200).json({ success: true, data: shows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get shows for a specific theater
export const getShowsByTheater = async (req, res) => {
  try {
    const shows = await Show.find({ theater: req.params.theaterId }).populate('movie');
    res.status(200).json({ success: true, data: shows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new show
export const createShow = async (req, res) => {
  try {
    const { movie, theater, showTime, price } = req.body;

    // Validate input fields
    if (!movie || !theater || !showTime || !price) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Create and save the new show
    const newShow = new Show({ movie, theater, showTime, price });
    await newShow.save();

    res.status(201).json({ success: true, message: 'Show created successfully', data: newShow });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing show
export const updateShow = async (req, res) => {
  try {
    const { movie, theater, showTime, price } = req.body;

    const updatedShow = await Show.findByIdAndUpdate(
      req.params.id,
      { movie, theater, showTime, price },
      { new: true }
    );

    if (!updatedShow) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    res.status(200).json({ success: true, data: updatedShow });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete a show
export const deleteShow = async (req, res) => {
  try {
    const deletedShow = await Show.findByIdAndDelete(req.params.id);

    if (!deletedShow) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    res.status(200).json({ success: true, message: 'Show deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
