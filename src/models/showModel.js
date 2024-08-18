import mongoose from 'mongoose';

const showSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
    showTime: { type: Date, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Show', showSchema);
