import express from 'express';
import dotenv from 'dotenv';
import apiRouter from './src/routes/index.js';
import serverConfig from './src/config/serverConfig.js';
import { dbConnect } from './src/config/dbConfig.js';
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config(); // Load environment variables

const app = express();

// Basic middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());




const corsOptions = {
  origin: [
    'https://cine-ticket-book.vercel.app', // Production frontend
    'http://localhost:5173' // Development frontend
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow required HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
};

app.use(cors(corsOptions));


 

// Test route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api', apiRouter);

const PORT = serverConfig.port;

const startServer = async () => {
  try {
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();
