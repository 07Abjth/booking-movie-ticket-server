import jwt from 'jsonwebtoken';

export const authTheaterOwner = (req, res, next) => {
  try {
    // Extract the token from cookies
    const token = req.cookies.token || '';

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided, authorization denied.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Log the decoded token (for debugging purposes)
    console.log(decoded);

    // Check if the user has the theaterOwner role
    if (decoded.role !== 'theaterOwner') {
      return res.status(403).json({ success: false, message: 'Access denied. Theater owners only.' });
    }

    // Attach decoded user info to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is not valid or has expired.' });
  }
};
