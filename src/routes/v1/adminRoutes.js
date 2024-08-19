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

const router = express.Router();

// User management routes
router.get('/users', getUsers);
router.route('/users/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// Movie management routes
router.route('/movies')
  .get(getMovies)
  .post(createMovie);
router.route('/movies/:id')
  .put(updateMovie)
  .delete(deleteMovie);

// Theater management routes
router.route('/theaters')
  .get(getTheaters)
  .post(createTheater);
router.route('/theaters/:id')
  .put(updateTheater)
  .delete(deleteTheater);

// Show management routes
router.route('/shows')
  .get(getShows)
  .post(createShow);
router.route('/shows/:id')
  .put(updateShow)
  .delete(deleteShow);

export default router;
