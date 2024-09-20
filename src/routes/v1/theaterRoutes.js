import express from 'express';
import {
  getTheaters,
  createTheater,
  getTheaterById,
  updateTheater,
  deleteTheater,
  getTheatersByLocation,
  addMoviesToTheater,
  getTheatersByIds,
  getTheatersByMovieId
} from '../../controllers/theaterControllers.js';
import authTheaterOwnerOrAdmin from '../../middleware/authTheaterOwnerOrAdmin.js';

const router = express.Router();

// Route to get all theaters or filter by location
router.get('/get-theaters', getTheaters);

// Route to create a new theater
router.post('/theaters', createTheater);

// Route to fetch theater details by ID
router.get('/theaters/:id', getTheaterById); // Fetch theater by ID

// Route to update an existing theater
router.put('/theaters/:id', authTheaterOwnerOrAdmin, updateTheater); // Update theater

// Route to delete a theater
router.delete('/theaters/:id', authTheaterOwnerOrAdmin, deleteTheater); // Delete theater

// Route to get theaters by location
router.get('/theaters/location/:location', getTheatersByLocation);

// Route to add movies to a theater
router.put('/:theaterId/movies', addMoviesToTheater);

// Route to fetch theaters by an array of Theater IDs
router.post('/theaters/:by-ids', getTheatersByIds); // Add this line



// Route to get theaters by movie ID
router.get('/theaters/movie/:movieId', getTheatersByMovieId);

export default router;
