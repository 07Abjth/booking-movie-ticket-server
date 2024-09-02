import express from 'express';
import { createRating, getRatings, updateRating, deleteRating } from '../../controllers/ratingControllers.js'; 

const router = express.Router();

// Route to create a new rating
router.post('/create-rating', createRating);

// Route to get ratings for a specific movie or user, or all ratings
router.get('/get-rating/:id', getRatings);

// Route to update a rating
router.put('/update-rating/:id', updateRating);

// Route to delete a rating
router.delete('/delete-rating/:id', deleteRating);

export default router;
