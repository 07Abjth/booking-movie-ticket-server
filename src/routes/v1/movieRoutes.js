import express from 'express';
import {
  getAllMovies,
  createMovie,
  getMovieById,
  updateMovie,
  deleteMovie,
  searchMovies,
} from '../../controllers/movieControllers.js';
import { authAdmin } from '../../middleware/authAdmin.js';
import { upload } from '../../middleware/uploadMiddleware.js';
import { authUser } from '../../middleware/authUser.js';

const router = express.Router();

// Corrected routes and HTTP methods
router.post('/create-movie', upload.single("poster"),createMovie);
router.get('/moviesList', getAllMovies);            
// router.get('/details', authUser, getMoviesDetails);            

router.get('/search', searchMovies);             
router.get('/getMovie/:id', authUser, getMovieById);                 
router.put('update/:id',authUser, updateMovie);                  
router.delete('delete/:id',authAdmin, deleteMovie);               

export default router;
