import TheaterOwner from '../models/theaterOwnerModel.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcrypt';

 
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
    const newOwner = new TheaterOwner({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
    });
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

