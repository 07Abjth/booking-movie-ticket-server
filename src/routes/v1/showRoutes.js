import express from 'express';
import {
  getShows,
  getShowById,
  getShowsByMovie,
  getShowsByTheater,
} from '../controllers/showControllers.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to get all shows
router.route('/').get(getShows);

// Route to get a specific show by ID
router.route('/:id').get(getShowById);

// Route to get shows for a specific movie
router.route('/movie/:movieId').get(getShowsByMovie);

// Route to get shows for a specific theater
router.route('/theater/:theaterId').get(getShowsByTheater);

export default router;
