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
} from '../controllers/adminControllers.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// User management routes
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id').get(protect, admin, getUserById).put(protect, admin, updateUser).delete(protect, admin, deleteUser);

// Movie management routes
router.route('/movies').get(protect, admin, getMovies).post(protect, admin, createMovie);
router.route('/movies/:id').put(protect, admin, updateMovie).delete(protect, admin, deleteMovie);

// Theater management routes
router.route('/theaters').get(protect, admin, getTheaters).post(protect, admin, createTheater);
router.route('/theaters/:id').put(protect, admin, updateTheater).delete(protect, admin, deleteTheater);

// Show management routes
router.route('/shows').get(protect, admin, getShows).post(protect, admin, createShow);
router.route('/shows/:id').put(protect, admin, updateShow).delete(protect, admin, deleteShow);

export default router;
