import jwt from 'jsonwebtoken';

export const authTheaterOwner = (req, res, next) => {
  try {
    // Extract token from cookies
    const token = req.cookies.token || '';

    // Check if token is missing
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided, authorization denied.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user has the 'theaterOwner' role
    if (!decoded || decoded.role !== 'theaterOwner') {
      return res.status(403).json({ success: false, message: 'Access denied. Theater owners only.' });
    }

    // Attach decoded user info to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is not valid or has expired.' });
  }
};
