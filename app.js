import express from 'express';
import dotenv from 'dotenv';
import apiRouter from './src/routes/index.js';
import serverConfig from './src/config/serverConfig.js';
import { dbConnect } from './src/config/dbConfig.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config(); // Load environment variables

const app = express();

// Basic middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());

// Configure CORS
const corsOptions = {
  origin: [
    'https://cine-ticket-book.vercel.app', // Production frontend
    'http://localhost:5173', 
    "http://localhost:5174",    // Development frontend
    'http://localhost:5175',               // Another frontend (if any)
  ],
  credentials: true, // Allow credentials (if needed)
};

app.use(cors(corsOptions));

// Test route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api', apiRouter); // All routes under /api

// Server startup
const PORT = serverConfig.port || 5000;

const startServer = async () => {
  try {
    await dbConnect(); // Establish DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();
