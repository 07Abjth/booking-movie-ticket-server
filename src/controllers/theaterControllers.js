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
 
 // Create a new theater
 export const createTheater = async (req, res) => {
  try {
    const { name, location, screens } = req.body;

    // Manual input validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Valid theater name is required' });
    }
    if (!location || typeof location !== 'string' || location.trim() === '') {
      return res.status(400).json({ success: false, message: 'Valid location is required' });
    }
    if (!screens || typeof screens !== 'number' || screens <= 0) {
      return res.status(400).json({ success: false, message: 'Valid number of screens is required' });
    }

    // Check if the theater already exists
    const existingTheater = await Theater.findOne({ name, location });
    if (existingTheater) {
      return res.status(400).json({ success: false, message: 'Theater already exists' });
    }

    // Create and save the new theater
    const newTheater = new Theater({ name, location, screens });
    await newTheater.save();

    res.status(201).json({ success: true, message: 'Theater created successfully', data: newTheater });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch theater details
export const getTheaterDetails = async (req, res) => {
  try {
    const { theaterId } = req.query; // Assume theaterId is provided as a query parameter

    // Validate the theaterId
    if (!theaterId) {
      return res.status(400).json({ success: false, message: 'Theater ID is required' });
    }

    // Find the theater by ID
    const theater = await Theater.findById(theaterId);

    if (!theater) {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }

    res.status(200).json({ success: true, data: theater });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update an existing theater
export const updateTheater = async (req, res) => {
  try {
    const { theaterId } = req.params;
    const { name, location, screens } = req.body;

    const updatedTheater = await Theater.findByIdAndUpdate(
      theaterId,
      { name, location, screens },
      { new: true }
    );

    if (!updatedTheater) {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }

    res.status(200).json({ success: true, data: updatedTheater });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a theater
export const deleteTheater = async (req, res) => {
  try {
    const { theaterId } = req.params;

    const deletedTheater = await Theater.findByIdAndDelete(theaterId);

    if (!deletedTheater) {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }

    res.status(200).json({ success: true, message: 'Theater deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// Get a specific theater by ID
export const getTheaterById = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id); // This gets the ID from URL params
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


