import express from 'express';
 import {theaterOwnerLogin, createTheaterOwnerAccount, updateTheaterOwnerProfile, getTheaterOwnerProfile} from '../../controllers/theaterOwnerControllers.js';
import { updateShow, deleteShow} from '../../controllers/showControllers.js'
import { createTheater, updateTheater, deleteTheater, getTheaterDetails } from '../../controllers/theaterControllers.js';
import authTheaterOwnerOrAdmin from '../../middleware/authTheaterOwnerOrAdmin.js';


const router = express.Router();

// Account Management Routes
router.post('/register', createTheaterOwnerAccount);
router.post('/login', theaterOwnerLogin);
router.put('/profile/update/:id', authTheaterOwnerOrAdmin, updateTheaterOwnerProfile);
router.get('/profile/:id', authTheaterOwnerOrAdmin, getTheaterOwnerProfile);

// Showtime Management Routes
router.put('/show/update/:id',authTheaterOwnerOrAdmin, updateShow);  
router.delete('/show/delete/:id', authTheaterOwnerOrAdmin, deleteShow);  

// Theater Management Routes
router.post('/theater/create-theater', authTheaterOwnerOrAdmin, createTheater);
router.put('/theater/update/:theaterId',authTheaterOwnerOrAdmin, updateTheater);
router.delete('/theater/delete/:theaterId', authTheaterOwnerOrAdmin, deleteTheater);
router.get('/theater/details', authTheaterOwnerOrAdmin, getTheaterDetails);

export default router;
