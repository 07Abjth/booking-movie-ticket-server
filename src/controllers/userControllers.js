 
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, confirmPassword } = req.body;

    if (!name || !email || !phoneNumber || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword, phoneNumber });
    await user.save();

    if (user) {
      const token = generateToken(user, "user");
      res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // <-- this is key!
  maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
});


      return res.status(201).json({
        success: true,
        message: "User created successfully",
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Log in a user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User does not exist.' });
    }

    const isPasswordValid = await bcrypt.compare(password, userExists.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(userExists, 'user');
    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // <-- this is key!
  maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
});

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update user details
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phoneNumber } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ success: true, message: "User profile updated successfully", data: user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// User Profile
export const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, message: "User data fetched successfully", data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Check user
export const checkUser = async (req, res) => {
  try {
    const { email, id } = req.query;
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    let user = email ? await User.findOne({ email }) : id ? await User.findById(id) : await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
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
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0)
    });
    res.json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
