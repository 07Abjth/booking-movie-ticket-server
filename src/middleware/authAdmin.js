import jwt from 'jsonwebtoken';

export const authAdmin = (req, res, next) => {
  try {
    // Extract the token from cookies
    const {token} = req.cookies || '';

    if (!token) {
      return res.status(401).json({ success: false, message: 'user not authenticated.' });
    }

    // Verify the token
    const tokenVerified = jwt.verify(token, process.env.JWT_SECRET);

    // Log the decoded token (for debugging purposes)
    console.log(tokenVerified);

    if(!tokenVerified){
      return res.status(400).json({ success: false, message: 'user not authenticated.' });

    }

if(tokenVerified.role !== "admin" ){
  return res.status(400).json({ success: false, message: 'user not authenticated.' });

}
    // Attach decoded user info to request
    req.user = tokenVerified;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is not valid or has expired.' });
  }
};
