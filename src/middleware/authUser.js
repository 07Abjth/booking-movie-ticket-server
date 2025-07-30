import jwt from 'jsonwebtoken';

export const authUser = (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.headers.authorization?.startsWith("Bearer ") &&
      req.headers.authorization.split(" ")[1]);

  console.log("Token received:", token);

  if (!token) {
    return res.status(403).json({ success: false, message: "Authentication token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err.message);
      return res.status(401).json({
        success: false,
        message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
      });
    }

    console.log("Decoded token:", decoded);

    // Attach entire user data and userId separately
    req.user = decoded;
    req.userId = decoded.id; // This is used in paymentControllers

    next();
  });
};
