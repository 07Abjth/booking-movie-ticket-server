import Theater from '../models/theaterModel.js';

// Get all theaters or filter by location
export const getTheaters = async (req, res) => {
  try {
    const { location } = req.query;

    // Build query object
    const query = {};
    if (location) {
      query.location = location;
    }

    // Fetch theaters based on the query
    const theaters = await Theater.find(query);
    res.status(200).json({ success: true, data: theaters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific theater by ID
export const getTheaterById = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id);
    if (theater) {
      return res.status(200).json({ success: true, data: theater });
    } else {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get theaters by location
export const getTheatersByLocation = async (req, res) => {
  try {
    const { location } = req.params;

    const theaters = await Theater.find({ location });
    if (theaters.length > 0) {
      return res.status(200).json({ success: true, data: theaters });
    } else {
      return res.status(404).json({ success: false, message: 'No theaters found for this location' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


