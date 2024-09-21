import express from 'express';
import { authTheaterOwnerOrAdmin } from '../../middleware/authTheaterOwnerOrAdmin.js';
import { authAdmin } from '../../middleware/authAdmin.js';
import {
  createShow,
  updateShow,
  deleteShow,
  getShowDetailsById,
  createMultipleShows,
  getShowsByMovieId,
  getShowTimesByTheaterId
  // getTheaterShowTimesForMovieId
} from '../../controllers/showControllers.js';

const router = express.Router();

// Theater owners and admins can create a show
router.post('/create-show', authTheaterOwnerOrAdmin, createShow);

// Theater owners and admins can update a show
router.put('/update-show/:id', authTheaterOwnerOrAdmin, updateShow);

// Theater owners and admins can delete a show
router.delete('/:id', authTheaterOwnerOrAdmin, deleteShow);

// Route to get show details by ID (open to all)
router.get('/show-details/:id', getShowDetailsById);

// Route for creating multiple shows
router.post('/create-multiple-shows', authAdmin, createMultipleShows);

// Route to get shows by movie ID
router.get('/movies/:movieId', getShowsByMovieId);


// router.get('/movies/:movieId', getTheaterShowTimesForMovieId);

router.get('/theater/:theaterId/show-times', getShowTimesByTheaterId);




export default router;
