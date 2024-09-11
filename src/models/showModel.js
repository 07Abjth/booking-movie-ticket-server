import mongoose from 'mongoose';

const showSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
    showTime: { type: Date, required: true },
    price: { type: Number, required: true, min: 0 },  // Ensure price is a positive number
  },
  { timestamps: true }
);

// Adding an index for faster lookups
showSchema.index({ movie: 1, theater: 1, showTime: 1 });

export default mongoose.model('Show', showSchema);
