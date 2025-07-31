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

const allowedOrigins = [
  "http://localhost:5173",
  "https://booking-movie-ticket-client.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Test route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// API routes
app.use('/api', apiRouter);

// Connect to DB before starting server
await dbConnect();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
