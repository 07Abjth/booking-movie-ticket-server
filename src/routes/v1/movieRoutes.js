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
router.post('/create-movie', upload.single("poster"), authAdmin, createMovie);  
router.get('/moviesList', getAllMovies);                                        
router.get('/details/:id',  getMovieById);                             
router.put('/update/:id', authAdmin, updateMovie);                              
router.delete('/delete/:id', authAdmin, deleteMovie);                           

// Additional routes for specific movie lists
router.get('/upcoming', getUpcomingMovies);                                     
router.get('/trending', getTrendingMovies);                                    
router.get('/new-releases', getNewReleases);                                   
router.post('/search', searchMovies);                                          



// Get movie details
router.get('/:movieId', getMovieDetails);




export default router;
