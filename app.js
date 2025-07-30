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
    'http://localhost:5174',
    'http://localhost:5175',
  ],
  credentials: true,
};

app.use(cors(corsOptions));

// Test route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// API routes
app.use('/api', apiRouter);

// Vercel expects an exported handler, not a running server
await dbConnect(); // Connect to DB before export

export default app;
