import express from 'express';
import {
  getAllMovies,
  createMovie,
  getMovieById,
  getMovieDetails,
  updateMovie,
  deleteMovie,
  searchMovies,
  getUpcomingMovies,     
  getTrendingMovies,     
  getNewReleases         
} from '../../controllers/movieControllers.js';
import { authAdmin } from '../../middleware/authAdmin.js';
import { upload } from '../../middleware/uploadMiddleware.js';
import { authUser } from '../../middleware/authUser.js';

const router = express.Router();

// Routes
router.post('/create-movie', upload.single("poster"), authAdmin, createMovie);   // Only admins can create movies
router.get('/moviesList', getAllMovies);                                         // List all movies
router.get('/details/:id', getMovieDetails);                             // Get movie by ID (requires user authentication)

router.get('/getMovie/:id', authUser, getMovieById);                             // Get movie by ID (requires user authentication)
router.put('/update/:id', authAdmin, updateMovie);                               // Update movie (admin only)
router.delete('/delete/:id', authAdmin, deleteMovie);                            // Delete movie (admin only)

// Additional routes for specific movie categories
router.get('/search', searchMovies);                                             // Search movies
router.get('/upcoming', getUpcomingMovies);                                      // Get upcoming movies
router.get('/trending', getTrendingMovies);                                      // Get trending movies
router.get('/newReleases', getNewReleases);                                     // Get new release movies

export default router;
