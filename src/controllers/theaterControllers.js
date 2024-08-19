import Theater from '../models/theaterModel.js';


// Create theater
export const createTheater = async (req, res) => {
  try {
    console.log(req.body); // Log the incoming request body

    const { name, location, screens } = req.body;

    if (!name || !location || !screens) {
      return res.status(400).json({ success: false, message: 'Name, location, and screens are required' });
    }

    // Check if theater already exists
    const existingTheater = await Theater.findOne({ name, location });
    
    if (existingTheater) {
      return res.status(400).json({ success: false, message: 'Theater already exists' });
    }

    // Create and save the new theater
    const newTheater = await Theater.create({ name, location, screens });

    res.status(201).json({ success: true, data: newTheater });

  } catch (error) {
    console.error('Error creating theater:', error); 
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all theaters
export const getTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find();
    return res.status(200).json({ success: true, data: theaters });
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
      res.status(404).json({ success: false, message: 'Theater not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update theater
export const updateTheater = async (req, res) => {
  try {
    const updatedTheater = await Theater.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Updating with the data passed in the request body
      { new: true } // Return the updated document
    );

    if (!updatedTheater) {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }

    res.status(200).json({ success: true, data: updatedTheater });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Delete theater
export const deleteTheater = async (req, res) => {
  try {
    const deletedTheater = await Theater.findByIdAndDelete(req.params.id);

    if (deletedTheater) {
      return res.status(200).json({ success: true, message: 'Theater deleted successfully' });
    } else {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
