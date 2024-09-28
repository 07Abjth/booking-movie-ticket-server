import express from 'express';
import { authTheaterOwner } from '../../middleware/authTheaterOwner.js';
import {theaterOwnerLogin, createTheaterOwnerAccount, updateTheaterOwnerProfile, getTheaterOwnerProfile} from '../../controllers/theaterOwnerControllers.js';
import { updateShow, deleteShow} from '../../controllers/showControllers.js'
import { createTheater, updateTheater, deleteTheater, getTheaterDetails } from '../../controllers/theaterControllers.js';


const router = express.Router();

// Account Management Routes
router.post('/register', createTheaterOwnerAccount);
router.post('/login', theaterOwnerLogin);
router.put('/profile/update/:id', authTheaterOwner, updateTheaterOwnerProfile);
router.get('/profile/:id', authTheaterOwner, getTheaterOwnerProfile);

// Showtime Management Routes
router.put('/show/update/:id', authTheaterOwner, updateShow);  
router.delete('/show/delete/:id', authTheaterOwner, deleteShow);  

// Theater Management Routes
router.post('/theater/create-theater', authTheaterOwner, createTheater);
router.put('/theater/update/:theaterId', authTheaterOwner, updateTheater);
router.delete('/theater/delete/:theaterId', authTheaterOwner, deleteTheater);
router.get('/theater/details', authTheaterOwner, getTheaterDetails);

export default router;
