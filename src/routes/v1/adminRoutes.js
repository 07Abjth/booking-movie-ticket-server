import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  getTheaters,
  createTheater,
  updateTheater,
  deleteTheater,
  getShows,
  createShow,
  updateShow,
  deleteShow,
} from '../../controllers/adminControllers.js';

import { authAdmin } from '../../middleware/authAdmin.js';

const router = express.Router();

// User management routes (assuming auth is not needed)
router.get('/users', getUsers);
router.get('/users/:id', getUserById);

// Protected routes (require admin authentication)
router.put('/users/:id', authAdmin, updateUser);
router.delete('/users/:id', authAdmin, deleteUser);

// Movie management routes
router.get('/movies', getMovies);
router.post('/movies', authAdmin, createMovie);  // Protect movie creation

// Protected routes (require admin authentication)
router.put('/movies/:id', authAdmin, updateMovie);
router.delete('/movies/:id', authAdmin, deleteMovie);

// Theater management routes
router.get('/theaters', getTheaters);
router.post('/theaters', authAdmin, createTheater);  // Protect theater creation

// Protected routes (require admin authentication)
router.put('/theaters/:id', authAdmin, updateTheater);
router.delete('/theaters/:id', authAdmin, deleteTheater);

// Show management routes
router.get('/shows', getShows);
router.post('/shows', authAdmin, createShow);  // Protect show creation

// Protected routes (require admin authentication)
router.put('/shows/:id', authAdmin, updateShow);
router.delete('/shows/:id', authAdmin, deleteShow);

export default router;