import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    paymentMethod: { type: String, required: true, minlength: 3, maxlength: 50 }, // e.g., 'Credit Card', 'PayPal'
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Payment', paymentSchema);
