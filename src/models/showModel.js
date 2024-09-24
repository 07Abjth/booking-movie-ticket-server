import mongoose from 'mongoose';

 const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // e.g., '09:00 AM'
}, { timestamps: true });

// Add an index for faster lookups
showSchema.index({ movie: 1, theater: 1, date: 1, time: 1 });

// Export the Show model (correct reference to showSchema)
export default mongoose.model('Show', showSchema);
