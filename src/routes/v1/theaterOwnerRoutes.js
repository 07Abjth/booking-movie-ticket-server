import express from 'express';
import { authTheaterOwner } from '../../middleware/authTheaterOwner.js';  // Middleware for theater owner authentication
import {
    theaterOwnerLogin,         // Login for theater owners
    createTheaterOwnerAccount, // Register a new theater owner account
    updateTheaterOwnerProfile, // Update theater owner profile
    getTheaterOwnerProfile,    // Fetch theater owner profile details
    createShowtime,       
    updateShowtime,       
    deleteShowtime,       
    getAllShowtimes,      
    updateTheaterDetails, 
    getTheaterDetails   
} from '../../controllers/theaterOwnerControllers.js';



const router = express.Router();

// Account Management Routes
router.post('/register', createTheaterOwnerAccount);  // Theater owner account creation
router.post('/login', theaterOwnerLogin);             // Theater owner login
router.put('/profile/update', authTheaterOwner, updateTheaterOwnerProfile);
router.put('/profile-update/:id', authTheaterOwner, updateTheaterOwnerProfile); 

router.get('/profile/', authTheaterOwner, getTheaterOwnerProfile);           

// Showtimes Management Routes
router.post('/showtime/create', authTheaterOwner, createShowtime);
router.put('/showtime/update/:id', authTheaterOwner, updateShowtime);
router.delete('/showtime/delete/:id', authTheaterOwner, deleteShowtime);
router.get('/showtimes', authTheaterOwner, getAllShowtimes);

// Theater Management Routes
router.put('/theater/update', authTheaterOwner, updateTheaterDetails);
router.get('/theater/details', authTheaterOwner, getTheaterDetails);

export default router;
