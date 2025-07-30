import jwt from 'jsonwebtoken';

const generateToken = (user, role) => {
  try {
    const token = jwt.sign(
      { id: user._id, role }, // Note: _id not id
      process.env.JWT_SECRET,
      { expiresIn: '1d' }     // 1 day expiry
    );
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
  }
};

export default generateToken;
