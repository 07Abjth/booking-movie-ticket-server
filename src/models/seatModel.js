import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema(
  {
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
    seatNumber: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Seat', seatSchema);
