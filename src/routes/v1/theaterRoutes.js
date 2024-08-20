import express from 'express';
import { getTheaters, getTheaterById, getTheatersByLocation } from '../../controllers/theaterControllers.js';

const router = express.Router();

// Route to get all theaters or filter by location
router.get('/get-theaters', getTheaters);

// Route to get a specific theater by ID
router.get('/get-theater-byId/:id', getTheaterById);

// Route to get theaters by location
router.get('/get-theaters-by-location/:location', getTheatersByLocation);

export default router;
