import jwt from 'jsonwebtoken';

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role || 'user' }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};


export default generateToken;
