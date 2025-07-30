import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  selectedSeats: [{ type: String, required: true }],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['paid', 'failed'], default: 'paid' },
  sessionId: { type: String },
  paymentIntentId: { type: String },
  currency: { type: String, default: 'INR' },
  paidAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
