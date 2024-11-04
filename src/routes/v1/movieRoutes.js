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
import {authTheaterOwnerOrAdmin} from '../../middleware/authTheaterOwnerOrAdmin.js';
 
const router = express.Router();

// // Routes
// router.post('/create-movie', upload.single("poster"),  createMovie);  
// router.get('/moviesList', getAllMovies);                                        
// router.get('/:movieId',  getMovieById);                             
// router.put('/update/:id', authAdmin, updateMovie);                              
// router.delete('/delete/:id', authAdmin, deleteMovie);                           

// // // Updated route to include movieId
// // router.get('/:movieId', getMovieDetails);


// // Additional routes for specific movie lists
// router.get('/upcoming', getUpcomingMovies);                                     
// router.get('/trending', getTrendingMovies);                                    
// router.get('/new-releases', getNewReleases);                                   
// router.post('/search', searchMovies);                                          
// // Get movie details
// router.get('/:movId', getMovieDetails);



// Routes
router.get('/moviesList', getAllMovies);                                       
router.get('/:movieId/basic', getMovieById); // Basic movie info by ID
router.get('/details/:movieId', getMovieDetails); // Detailed movie info by ID

// Additional routes
router.get('/upcoming', getUpcomingMovies); // Upcoming movies
router.get('/trending', getTrendingMovies); // Trending movies
router.get('/new-releases', getNewReleases); // New releases
router.post('/search', searchMovies); // Search movies



export default router;
