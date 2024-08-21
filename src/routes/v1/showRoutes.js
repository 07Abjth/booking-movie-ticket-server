import express from 'express';
import { authTheaterOwner } from '../../middleware/authTheaterOwner.js';
import { createShow, updateShow, deleteShow, getAllShows } from '../../controllers/showControllers.js';

const router = express.Router();

// Showtime Management Routes

// Route for theater owners and admins to create a show
router.post('/create', authTheaterOwner, createShow);

// Route for theater owners and admins to update a show
router.put('/update/:id', authTheaterOwner, updateShow);

// Route for theater owners and admins to delete a show
router.delete('/delete/:id', authTheaterOwner, deleteShow);

// Route to get all shows (open to all)
router.get('/all-show', getAllShows);

export default router;
