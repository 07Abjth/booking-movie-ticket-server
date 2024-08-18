import jwt from 'jsonwebtoken';

export const authUser = (req, res, next) => {
  try {
    // Extract token from cookies
    const token = req.cookies.token || '';

    // Check if token is missing
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided, authorization denied.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token cannot be decoded, return error
    if (!decoded) {
      return res.status(400).json({ success: false, message: 'User not authenticated' });
    }

    // Attach decoded user info to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Return error for invalid or expired tokens
    return res.status(401).json({ success: false, message: 'Token is not valid or has expired.' });
  }
};
