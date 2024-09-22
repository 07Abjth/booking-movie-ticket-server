import express from 'express';
import {    reserveSeats, createSeats, deleteSeats,   fetchSeatLayout } from '../../controllers/seatControllers.js';
import { authTheaterOwner } from '../../middleware/authTheaterOwner.js';

const router = express.Router();
 

// Route to reserve seats (protected route for authenticated users)
router.post('/reserve', authTheaterOwner, reserveSeats);

// Route to create seats (protected route for Theater Owners only)
router.post('/create',  createSeats);

// Route to delete seats (protected route for Theater Owners only)
router.delete('/delete', authTheaterOwner, deleteSeats);

 
// // Fetch seats for a specific theater
// router.get('/theater/:theaterId', getSeatsForTheater);  // Modified to theater

// // Fetch seat layout for a theater
// router.get('/layout/theater/:theaterId', getSeatLayout);  // Modified to theater



// Route to fetch seat layout for a specific theater and show
router.get('/theater/:theaterId/seats', fetchSeatLayout);

export default router;
