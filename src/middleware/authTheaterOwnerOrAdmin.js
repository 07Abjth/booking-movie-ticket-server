import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Middleware to allow only Theater Owners or Admins to access
export const authTheaterOwnerOrAdmin = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.header('Authorization');
    
    // Check if the Authorization header exists and is formatted correctly
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
    }
    
    // Extract the token
    const token = authHeader.replace('Bearer ', '');

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID extracted from the token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the user is either a Theater Owner or an Admin
    if (user.role !== 'theater_owner' && user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Only admins or theater owners can perform this action' });
    }

    // If valid, attach the user to the request object for later use in the route handler
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    
    // Distinguish between token expiration and invalid token errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Token is not valid' });
    } else {
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
};

export default authTheaterOwnerOrAdmin;
