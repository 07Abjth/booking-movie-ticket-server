import jwt from 'jsonwebtoken';

export const authUser = (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    // If token is missing, return a 403 Forbidden error
    if (!token) {
      console.log('Token missing');
      return res.status(403).json({ success: false, message: 'User not authenticated. Token missing.' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log('Token verification failed:', err.message);
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
      }

      // Attach the user to the request object
      req.user = decoded;
      console.log('Token decoded:', decoded);

      // Proceed to the next middleware or route handler
      next();
    });
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
};
