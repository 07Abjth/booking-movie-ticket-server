import jwt from 'jsonwebtoken';

// Generate a token for the user
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role:role ||'user'},  process.env.JWT_SECRET, {
    expiresIn: '1d', // Token expiration time
  });
};

export default generateToken;
