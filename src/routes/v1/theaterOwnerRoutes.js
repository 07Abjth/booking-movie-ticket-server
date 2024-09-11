import express from 'express';
import { authTheaterOwner } from '../../middleware/authTheaterOwner.js';
import {theaterOwnerLogin, createTheaterOwnerAccount, updateTheaterOwnerProfile, getTheaterOwnerProfile} from '../../controllers/theaterOwnerControllers.js';
import {createShow, updateShow, deleteShow, getAllShows, } from '../../controllers/showControllers.js'
import { createTheater, updateTheater, deleteTheater, getTheaterDetails } from '../../controllers/theaterControllers.js';


const router = express.Router();

// Account Management Routes
router.post('/register', createTheaterOwnerAccount);
router.post('/login', theaterOwnerLogin);
router.put('/profile/update/:id', authTheaterOwner, updateTheaterOwnerProfile);
router.get('/profile/:id', authTheaterOwner, getTheaterOwnerProfile);

// Showtime Management Routes
router.post('/show/create', authTheaterOwner, createShow); // Updated route to match function name
router.put('/show/update/:id', authTheaterOwner, updateShow); // Updated route to match function name
router.delete('/show/delete/:id', authTheaterOwner, deleteShow); // Updated route to match function name
router.get('/shows', authTheaterOwner, getAllShows); // Updated route to match function name

// Theater Management Routes
router.post('/theater/create-theater', authTheaterOwner, createTheater);
router.put('/theater/update/:theaterId', authTheaterOwner, updateTheater);
router.delete('/theater/delete/:theaterId', authTheaterOwner, deleteTheater);
router.get('/theater/details', authTheaterOwner, getTheaterDetails);

export default router;
