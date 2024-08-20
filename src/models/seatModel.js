import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema(
  {
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
    show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },  // Add show reference
    seatNumber: { type: String, required: true },
    status: { type: String, default: 'available', enum: ['available', 'reserved', 'booked'] }, // Status field
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Seat', seatSchema);
