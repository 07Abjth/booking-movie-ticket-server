import express from 'express';
import {
  createSeatLayout,
  getSeatLayout,
  updateSeatLayout,
  deleteSeatLayout
} from '../controllers/SeatLayoutController.js';

const router = express.Router();

// Route to create a new seat layout
router.post('/theater/:theaterId/show/:showId/layout', createSeatLayout);

// Route to get seat layout by theaterId and showId
router.get('/theater/:theaterId/show/:showId/layout', getSeatLayout);

// Route to update a seat layout
router.put('/theater/:theaterId/show/:showId/layout', updateSeatLayout);

// Route to delete a seat layout
router.delete('/theater/:theaterId/show/:showId/layout', deleteSeatLayout);

export default router;
