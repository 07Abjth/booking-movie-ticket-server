import Show from '../models/showModel.js';
import TheaterOwner from '../models/theaterOwnerModel.js';
import Theater from '../models/theaterModel.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcrypt';

// Account Management Controllers

// Register a new theater owner account
export const createTheaterOwnerAccount = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address } = req.body;

    // Check if the owner is already registered
    const existingOwner = await TheaterOwner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new theater owner
    const newOwner = new TheaterOwner({ name, email, password: hashedPassword, phoneNumber, address, role: "theater-owner" });
    await newOwner.save();

    res.status(201).json({ success: true, message: 'Theater owner account created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Log in a theater owner
export const theaterOwnerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Find the theater owner by email
    const owner = await TheaterOwner.findOne({ email });
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Theater owner not found' });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(owner._id, owner.role);

    // Set the token in a cookie (if using cookies)
    res.cookie('token', token, {
      // httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      // sameSite: 'strict',
    });

    res.status(200).json({ success: true, message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Update the theater owner profile

export const updateTheaterOwnerProfile = async (req, res) => {
  try {
    // Destructure the fields from request body
    const { name, email, phoneNumber, address } = req.body;

    // Validate input
    if (!name || !email || !phoneNumber) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }

    // Find and update the theater owner's details
    const updatedOwner = await TheaterOwner.findByIdAndUpdate(
      req.user.id, 
      { name, email, phoneNumber, address },
      { new: true, runValidators: true } // runValidators ensures schema validation on update
    );

    if (!updatedOwner) {
      return res.status(404).json({ success: false, message: 'Theater owner not found' });
    }

    res.status(200).json({ success: true, data: updatedOwner });
  } catch (error) {
    console.error('Error updating theater owner profile:', error); // Log error for debugging
    res.status(500).json({ success: false, message: 'An error occurred while updating profile' });
  }
};



// Fetch the theater owner profile details
export const getTheaterOwnerProfile = async (req, res) => {
  try {
    const owner = await TheaterOwner.findById(req.user.id); // Fetch profile of the authenticated owner

    if (!owner) {
      return res.status(404).json({ success: false, message: 'Theater owner not found' });
    }

    res.status(200).json({ success: true, data: owner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Show Management Controllers


// Create a new show
export const createShow = async (req, res) => {
  try {
    const { movieId, theaterId, showTime, price } = req.body;

    const newShow = new Show({ movie: movieId, theater: theaterId, showTime, price });
    await newShow.save();

    res.status(201).json({ success: true, message: 'Show created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing show
export const updateShow = async (req, res) => {
  try {
    const { id } = req.params;
    const { movieId, theaterId, showTime, price } = req.body;

    const updatedShow = await Show.findByIdAndUpdate(
      id,
      { movie: movieId, theater: theaterId, showTime, price },
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
    const { id } = req.params;

    const deletedShow = await Show.findByIdAndDelete(id);

    if (!deletedShow) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    res.status(200).json({ success: true, message: 'Show deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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


// Theater Management Controllers

// Create a new theater
export const createTheater = async (req, res) => {
  try {
    const { name, location, screens } = req.body;

    // Validate input fields
    if (!name || !location || !screens) {
      return res.status(400).json({ success: false, message: 'Name, location, and screens are required' });
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



