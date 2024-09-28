import express from 'express';
import { authTheaterOwnerOrAdmin } from '../../middleware/authTheaterOwnerOrAdmin.js';
import { authAdmin } from '../../middleware/authAdmin.js';
import {
  updateShow,
  deleteShow,
  getShowDetailsById,
  createShowOrMultipleShows,
  getShowsByMovieId,
} from '../../controllers/showControllers.js';

const router = express.Router();

router.post('/create-show/',  createShowOrMultipleShows);


// Theater owners and admins can update a show
router.put('/update-show/:id', authTheaterOwnerOrAdmin, updateShow);

// Theater owners and admins can delete a show
router.delete('/:id', authTheaterOwnerOrAdmin, deleteShow);

// Route to get show details by ID (open to all)
router.get('/show-details/:id', getShowDetailsById);



// New route to get shows by movie ID
router.get('/movies/:movieId', getShowsByMovieId);


export default router;
