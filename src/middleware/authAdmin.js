import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js'; 

// Middleware for User Authentication
// export const authAdmin = (req, res, next) => {
//   try {
//     // Extract token from headers or cookies
//     const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

//     // If token is missing, return an error
//     if (!token) {
//       return res.status(401).json({ success: false, message: 'Admin not authenticated. Token missing.' });
//     }

//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Log decoded token for debugging
//     console.log('Decoded token:', decoded);

//     // Attach the user to the request object
//     req.user = decoded;

//     // Proceed to the next middleware or route handler
//     next();
//   } catch (error) {
//     console.error('Error verifying token:', error.message); // Log detailed error
//     return res.status(401).json({ success: false, message: 'Token is not valid or has expired.' });
//   }
// };

// export const authAdmin = (req, res, next) => {
//   try {
//     const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

//     // Log the token for debugging
//     console.log('Token received in authAdmin middleware:', token);

//     if (!token) {
//       return res.status(401).json({ success: false, message: 'Admin not authenticated. Token missing.' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Log the decoded token
//     console.log('Decoded token in authAdmin middleware:', decoded);

//     req.user = decoded;

//     next();
//   } catch (error) {
//     console.error('Error verifying token in authAdmin:', error.message);
//     return res.status(401).json({ success: false, message: 'Token is not valid or has expired.' });
//   }
// };
export const authAdmin = (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user role is admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You do not have admin privileges' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token in authAdmin:', error.message);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
