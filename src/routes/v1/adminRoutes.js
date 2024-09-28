import express from 'express';
import {createMovie,updateMovie,deleteMovie,} from '../../controllers/movieControllers.js';
import {createAdmin,loginAdmin,getUsers,getUserById,updateUser,deleteUser, deleteTheaterOwner, checkAdmin} from '../../controllers/adminControllers.js';
import {createTheater,updateTheater,deleteTheater} from '../../controllers/theaterControllers.js';
import { updateShow,deleteShow,} from '../../controllers/showControllers.js';
import { updateTheaterOwnerProfile } from '../../controllers/theaterOwnerControllers.js';


import { upload } from '../../middleware/uploadMiddleware.js';
import { authAdmin } from '../../middleware/authAdmin.js';
import { authTheaterOwner } from '../../middleware/authTheaterOwner.js';

const router = express.Router();


//Create admin
router.post('/create', createAdmin);

//LoginAdmin
router.post('/login', loginAdmin);

//check admin
router.get('/check-admin', checkAdmin)

// User management routes (assuming auth is not needed)
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/update-users/:id', authAdmin, updateUser);
router.delete('/delete-users/:id', authAdmin, deleteUser);


// Movie management routes
router.post('/create-movie', authAdmin, upload.single('poster'), createMovie);
router.put('/update-movies/:id', authAdmin, updateMovie);
router.delete('/delete-movies/:id', authAdmin, deleteMovie);

// Theater management routes
router.post('/theaters', authAdmin, createTheater);  // Protect theater creation
router.put('/update-theaters/:id', authAdmin, updateTheater);
router.delete('/delete-theaters/:id', authAdmin, deleteTheater);

//Theater owner management
router.put('/update-theaters/:id', authAdmin, updateTheaterOwnerProfile);
router.delete('/delete-theaterOwner/:id', authTheaterOwner, deleteTheaterOwner);

// Show management routes
 router.put('/update-shows/:id', authAdmin, updateShow);
router.delete('/delete-shows/:id', authAdmin, deleteShow);

export default router;