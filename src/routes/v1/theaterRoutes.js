import express from 'express';
import {
  getTheaters,
  createTheater,
  getTheaterDetails,
  updateTheater,
  deleteTheater,
  getTheaterById,
  getTheatersByLocation
} from '../../controllers/theaterControllers.js'; // Adjust the path as needed

const router = express.Router();

// Route to get all theaters or filter by location
router.get('/get-theaters', getTheaters);

// Route to create a new theater
router.post('/create-theater', createTheater);

// Route to fetch theater details by ID
router.get('/details', getTheaterDetails);

// Route to update an existing theater
router.put('/:theaterId', updateTheater);

// Route to delete a theater
router.delete('/:theaterId', deleteTheater);

// Route to get a specific theater by ID
router.get('/details-by-:id', getTheaterById);

// Route to get theaters by location
router.get('/location/:location', getTheatersByLocation);

export default router;
