import express from 'express';
import {
  getShows,
  getShowById,
  getShowsByMovie,
  getShowsByTheater,
} from '../../controllers/showControllers.js';

const router = express.Router();

// Route to get all shows
router.get('/', getShows);

// Route to get a specific show by ID
router.get('/:id', getShowById);

// Route to get shows for a specific movie
router.get('/movie/:movieId', getShowsByMovie);

// Route to get shows for a specific theater
router.get('/theater/:theaterId', getShowsByTheater);

export default router;
