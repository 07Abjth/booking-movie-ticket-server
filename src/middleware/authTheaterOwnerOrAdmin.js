import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Middleware to allow only Theater Owners or Admins to access
export const authTheaterOwnerOrAdmin = async (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from the token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the user is either a Theater Owner or an Admin
    if (user.role !== 'theater_owner' && user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Only admins or theater owners can perform this action' });
    }

    // If the user is valid, attach the user object to the request and proceed
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ success: false, message: 'Token is not valid or has expired' });
  }
};

export default authTheaterOwnerOrAdmin;
