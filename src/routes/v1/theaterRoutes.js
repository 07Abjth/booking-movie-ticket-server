import express from 'express';
import { createTheater, getTheaters, getTheaterById, updateTheater, deleteTheater } from '../../controllers/theaterControllers.js';



const router = express.Router();

// Route to create a new theater
router.post('/create', createTheater);

// Route to get all theaters
router.get('/get-theater', getTheaters);

// Route to get a specific theater by ID
router.get('/get-specific-theater/:id', getTheaterById);

// Route to update a theater by ID
router.put('/update-theater/:id', updateTheater);

// Route to delete a specific theater by ID
router.delete('/delete/:id', deleteTheater);

export default router;
