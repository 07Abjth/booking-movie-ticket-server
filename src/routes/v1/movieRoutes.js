import express from 'express';
import {
  getAllMovies,
  createMovie,
  getMovieById,
  updateMovie,
  deleteMovie,
  searchMovies,
  getUpcomingMovies,     
  getTrendingMovies,     
  getNewReleases,
   getMovieDetails,
} from '../../controllers/movieControllers.js';
import { authAdmin } from '../../middleware/authAdmin.js';
import { upload } from '../../middleware/uploadMiddleware.js';
import { authUser } from '../../middleware/authUser.js';
 
const router = express.Router();

// Routes
router.post('/create-movie', upload.single("poster"), authAdmin, createMovie);  // Only admins can create movies
router.get('/moviesList', getAllMovies);                                       // List all movies
router.get('/details/:id',  getMovieById);                            // Get movie by ID (requires user authentication)
router.put('/update/:id', authAdmin, updateMovie);                             // Update movie (admin only)
router.delete('/delete/:id', authAdmin, deleteMovie);                          // Delete movie (admin only)

// Additional routes for specific movie lists
router.get('/upcoming', getUpcomingMovies);                                    // Get upcoming movies
router.get('/trending', getTrendingMovies);                                    // Get trending movies
router.get('/new-releases', getNewReleases);                                   // Get new releases
router.post('/search', searchMovies);                                         // Search movies



// Get movie details
router.get('/:movieId', getMovieDetails);




export default router;
