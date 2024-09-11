import express from 'express';
import { authTheaterOwnerOrAdmin } from '../../middleware/authTheaterOwnerOrAdmin.js'; // Updated middleware to include both roles
import { createShow, updateShow, deleteShow, getAllShows } from '../../controllers/showControllers.js';

const router = express.Router();

// Showtime Management Routes

// Route for theater owners and admins to create a show
router.post('/', authTheaterOwnerOrAdmin, createShow);

// Route for theater owners and admins to update a show
router.put('/:id', authTheaterOwnerOrAdmin, updateShow);

// Route for theater owners and admins to delete a show
router.delete('/:id', authTheaterOwnerOrAdmin, deleteShow);

// Route to get all shows (open to all)
router.get('/', getAllShows);

export default router;
