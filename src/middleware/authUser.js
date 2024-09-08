
import jwt from 'jsonwebtoken';

export const authUser = (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization.split(' ');
      if (authHeader[0] === 'Bearer') {
        token = authHeader[1];
      }
    }

    // If token is missing, return a 403 Forbidden error
    if (!token) {
      return res.status(403).json({ success: false, message: 'User not authenticated. Token missing.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'User not authenticated. Token not decoded.' });
    }

    // Log decoded token for debugging (remove or be cautious in production)
    console.log('Decoded token:', decoded);

    // Attach the user to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message); // Log detailed error
    return res.status(401).json({ success: false, message: 'Token is not valid or has expired.' });
  }
};
