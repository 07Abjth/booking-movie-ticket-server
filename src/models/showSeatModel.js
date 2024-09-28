// models/ShowSeat.js
import mongoose from 'mongoose';

const showSeatSchema = new mongoose.Schema({
  seat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat',
    required: true,
    index: true,
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'booked'],
    default: 'available',
  },
  price: {
    type: Number,
    required: true,
  },
  reservationExpiry: {
    type: Date,
    default: null,
  },
}, { 
  timestamps: true 
});

// Ensure each seat-show combination is unique
showSeatSchema.index({ show: 1, seat: 1 }, { unique: true });

export default mongoose.model('ShowSeat', showSeatSchema);
