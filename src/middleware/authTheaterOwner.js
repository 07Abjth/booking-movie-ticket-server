import jwt from 'jsonwebtoken';

export const authTheaterOwner = (req, res, next) => {
  try {
    // Extract the token from cookies
    const token = req.cookies.token;

    // Check if token is missing
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided, authorization denied.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Log the decoded token (for debugging purposes)
    console.log(decoded);

    // Check if the user role is 'theater-owner' or 'admin'
    if (decoded.role !== 'theater-owner' && decoded.role !== 'admin'){
      return res.status(403).json({ success: false, message: 'Forbidden: Access is denied.' });
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
