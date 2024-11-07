import mongoose from 'mongoose';


const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: Object, required: true },  // Movie details
  theater: { type: Object, required: true },  // Theater details
  showTime: { type: String, required: true },  // Show timing
  selectedSeats: [{ type: String, required: true }],  // Reserved seats
  totalAmount: { type: Number, required: true },  // Total price for the booking
  paymentStatus: { type: String, enum: ['paid', 'pending'], default: 'pending' },
  transactionId: { type: String },  // To store transaction ID from payment gateway
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.model('Booking', bookingSchema);