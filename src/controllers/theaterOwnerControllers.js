import TheaterOwner from '../models/theaterOwnerModel.js'; 
import Theater from '../models/theaterModel.js'; 
import generateToken from '../utils/generateToken.js'; 
import bcrypt from 'bcrypt'
// Account Management Controllers

// Register a new theater owner account
export const createTheaterOwnerAccount = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address } = req.body;
console.log(req.body);

    // Check if the owner is already registered
    const existingOwner = await TheaterOwner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new theater owner
    const newOwner = new TheaterOwner({ name, email, password: hashedPassword, phoneNumber, address });
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
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure flag for HTTPS
      sameSite: 'strict', // SameSite attribute to prevent CSRF
    });

    // Send response
    res.status(200).json({ success: true, message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// Update the theater owner profile
export const updateTheaterOwnerProfile = async (req, res) => {
  try {
    const { name, email, phoneNumber, address } = req.body;

    // Update the theater owner's details
    const updatedOwner = await TheaterOwner.findByIdAndUpdate(
      req.user.id, // Assuming req.user is set by auth middleware
      { name, email, phoneNumber, address },
      { new: true }
    );

    if (!updatedOwner) {
      return res.status(404).json({ success: false, message: 'Theater owner not found' });
    }

    res.status(200).json({ success: true, data: updatedOwner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Fetch the theater owner profile details
export const getTheaterOwnerProfile = async (req, res) => {
  try {
    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid theater owner ID' });
    }

    // Find the theater owner by ID
    const owner = await TheaterOwner.findById(req.params.id);

    // If owner is not found, return 404
    if (!owner) {
      return res.status(404).json({ success: false, message: 'Theater owner not found' });
    }

    // Return the theater owner's details
    res.status(200).json({ success: true, data: owner });
  } catch (error) {
    // Handle errors during the request
    res.status(500).json({ success: false, message: error.message });
  }
};


// Showtime Management Controllers

// Create a new showtime
export const createShowtime = async (req, res) => {
  try {
    const { movieId, theaterId, startTime, endTime } = req.body;

    // Create and save the new showtime
    const newShowtime = new Showtime({ movieId, theaterId, startTime, endTime });
    await newShowtime.save();

    res.status(201).json({ success: true, message: 'Showtime created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing showtime
export const updateShowtime = async (req, res) => {
  try {
    const { id } = req.params;
    const { movieId, theaterId, startTime, endTime } = req.body;

    const updatedShowtime = await Showtime.findByIdAndUpdate(
      id,
      { movieId, theaterId, startTime, endTime },
      { new: true }
    );

    if (!updatedShowtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    res.status(200).json({ success: true, data: updatedShowtime });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a showtime
export const deleteShowtime = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedShowtime = await Showtime.findByIdAndDelete(id);

    if (!deletedShowtime) {
      return res.status(404).json({ success: false, message: 'Showtime not found' });
    }

    res.status(200).json({ success: true, message: 'Showtime deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch all showtimes
export const getAllShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.find();
    res.status(200).json({ success: true, data: showtimes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Theater Management Controllers

// Update theater details
export const updateTheaterDetails = async (req, res) => {
  try {
    const { theaterId, name, location, seats } = req.body;

    const updatedTheater = await Theater.findByIdAndUpdate(
      theaterId,
      { name, location, seats },
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

// Fetch theater details
export const getTheaterDetails = async (req, res) => {
  try {
    const theaterId = req.query.theaterId; // Assume theaterId is provided as a query parameter

    const theater = await Theater.findById(theaterId);

    if (!theater) {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }

  
    
    res.status(200).json({ success: true, data: theater });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
