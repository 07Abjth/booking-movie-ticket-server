// models/Seat.js
import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
  },
  row: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Regular', 'Premium', 'Luxury'],
    default: 'Regular',
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true,
    index: true,
  },
}, { 
  timestamps: true 
});

// Ensure seat numbers are unique within a theater
seatSchema.index({ theater: 1, seatNumber: 1 }, { unique: true });

export default mongoose.model('Seat', seatSchema);
