import express from 'express';
import {
  loginUser,
  registerUser,
  updateUserProfile,
  checkUser,
  deleteUser,
  userProfile,
  logoutUser
} from '../../controllers/userControllers.js';
import { authUser } from '../../middleware/authUser.js';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

// Check if a user exists by email or ID
router.get('/check-user', authUser, checkUser);

// Get the profile of the authenticated user
router.get('/profile', authUser, userProfile);

// Update the profile of the authenticated user
router.put('/update/:id', authUser, updateUserProfile);

// Delete a user by ID
router.delete('/delete/:id', authUser, deleteUser);

// Logout a user
router.post('/logout', authUser, logoutUser);

export default router;
