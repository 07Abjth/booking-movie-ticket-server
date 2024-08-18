import express from 'express';
import {
  getAllMovies,
  createMovie,
  getMovieById,
  updateMovie, 
  deleteMovie,
  searchMovies,
} from '../../controllers/movieControllers.js';
import { upload } from '../../middleware/uploadMiddleware.js';
import { authUser } from '../../middleware/authUser.js';

const router = express.Router();

// Corrected routes and HTTP methods
router.get('/moviesList', getAllMovies);            
router.post('/create', upload.single("poster"),createMovie);
router.get('/search', searchMovies);             
router.get('/getMovie/:id', authUser, getMovieById);                 
router.put('update/:id',authUser, updateMovie);                  
router.delete('delete/:id', deleteMovie);               

export default router;
