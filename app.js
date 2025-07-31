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
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  'http://localhost:3000', // React dev server
  'https://booking-movie-ticket-client.vercel.app', // production frontend
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
