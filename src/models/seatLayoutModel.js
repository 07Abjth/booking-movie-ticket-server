import mongoose from 'mongoose';

// Schema for seat layout of a specific show in a theater
const seatLayoutSchema = new mongoose.Schema({
  theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true }, // Refers to the Theater model
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true }, // Refers to the Show model
  layout: [[String]], // 2D array representing the seat layout (e.g., [['A1', 'A2'], ['B1', 'B2']])
  seats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seat' }], // Array of seat ObjectIds from the Seat model
});

// Create the SeatLayout model
const SeatLayoutModel = mongoose.model('SeatLayout', seatLayoutSchema);

export default SeatLayoutModel;
