import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const serverConfig = {
  port: process.env.PORT || 7000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/moviebooking',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
};

export default serverConfig;
