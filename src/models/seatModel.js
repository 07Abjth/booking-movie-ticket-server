import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  seatNumber: { type: String, required: true },
  row: { type: String }, // Optional: Row of the seat
  column: { type: String }, // Optional: Column of the seat
  status: { type: String, default: 'available', enum: ['available', 'reserved', 'booked'] },
  price: { type: Number, required: true },
}, { timestamps: true });

seatSchema.index({ theater: 1, show: 1, seatNumber: 1 }); // For faster querying

export default mongoose.model('Seat', seatSchema);
