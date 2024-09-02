import express from 'express';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';
import serverConfig from './config/serverConfig.js';
import { dbConnect } from './config/dbConfig.js';
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config(); // Load environment variables

const app = express();

// Basic middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials:true,

}))

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
