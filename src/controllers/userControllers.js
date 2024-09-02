import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash the password
    const salt = 10;
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user
    const user = new User({ name, email, password: hashedPassword, phoneNumber });
    await user.save();

    // Send response 
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
    });

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};



// Log in a user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields required." });
    }

    // Find the user by email
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(404).json({ success: false, message: 'User does not exist' });
    }

    // Compare provided password with stored hashed password
    const passwordMatch = bcrypt.compareSync(password, userExist.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = generateToken(userExist._id, userExist.role);

    // Set the token in a cookie with security settings
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure flag for HTTPS
      sameSite: 'strict', // SameSite attribute to prevent CSRF
    });

    // Send response
    res.json({ success: true, message: "User logged in successfully", token });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};




    // Update user details
    export const updateUserProfile = async (req, res, next) => {
      try {
        const { id } = req.params;
        const { name, email, password, phoneNumber } = req.body;
    
        // Find the user by ID
        const user = await User.findByIdAndUpdate(id);
        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
    
        // Update user details
        user.name = name || user.name;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
    
        // If password is provided, hash it before saving
        if (password) {
          const salt = 10;
          user.password = bcrypt.hashSync(password, salt);
        }
    
        // Save the updated user information
        await user.save();
    
        // Send response
        res.json({ success: true, message: "User profile updated successfully", data: user });
    
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    };
    
//User Profile
    export const userProfile = async (req,res)=>{
      try {
        const user = req.user;

const useData = await User.find({email:user.email}).select("-password")
res.json({ success: true, message: "User data fetched successfully", data: useData });

 
    // Check if user was found
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Send back user data (excluding sensitive information)
    return res.json({ success: true, message: "User data fetched successfully", data: userData });
    
  } catch (error) {
    // Handle any errors
    return res.status(500).json({ success: false, message: error.message });
  }
};

   // Check if a user exists by email or ID
export const checkUser = async (req, res, next) => {
  try {
    const { email, id } = req.query;

    // Check if user is authenticated (assuming req.user is set in authentication middleware)
    if (!req.user) {
      return res.status(400).json({ success: false, message: "User not authenticated" });
    }

    // Search for user by email or ID
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (id) {
      user = await User.findById(id);
    }

    // If no user is found, return an error
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If user is found, return success with user data
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Log out a user
export const logoutUser = (req, res) => {
  try {
    // Clear the token cookie
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure flag for HTTPS
      sameSite: 'strict', // SameSite attribute to prevent CSRF
      expires: new Date(0) // Set cookie expiry to the past to delete it
    });

    // Send a response indicating successful logout
    res.json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({ success: false, message: error.message });
  }
};