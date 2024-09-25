import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
    unique: true // Ensures that seat numbers are unique globally or within a compound index
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'booked'], // Added 'reserved' for future reservation logic
    default: 'available',
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',  // Reference to the Theater model
    required: true,
    index: true // Index to speed up queries by theater
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show', // Reference to the Show model
    required: true,
    index: true // Index to speed up queries by show
  },
  price: {
    type: Number,
    required: true,  // Ensures that each seat has a price associated with it
  },
  reservationExpiry: {  // Correctly place reservationExpiry here
    type: Date, // Added to track when the reservation expires
    default: null, // Null when not reserved
  }
}, { 
  timestamps: true // Automatically adds `createdAt` and `updatedAt` timestamps
});

// Create a compound index to ensure unique seat numbers within the context of a specific theater and show
seatSchema.index({ theater: 1, show: 1, seatNumber: 1 }, { unique: true });

export default mongoose.model('Seat', seatSchema);
