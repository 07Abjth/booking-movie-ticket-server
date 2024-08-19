import express from 'express';
import { createRating, getRatings, updateRating, deleteRating } from '../../controllers/ratingControllers.js'; 

const router = express.Router();

// Route to create a new rating
router.post('/', createRating);

// Route to get ratings for a specific movie or user, or all ratings
router.get('/', getRatings);

// Route to update a rating
router.put('/:ratingId', updateRating);

// Route to delete a rating
router.delete('/:ratingId', deleteRating);

export default router;
