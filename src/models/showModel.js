// import mongoose from 'mongoose';

// const showSchema = new mongoose.Schema(
//   {
//     movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
//     theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
//     date: { type: Date, required: true },  
//     time: { type: String, required: true }, // Time of the show, e.g., '09:00 AM'
//     price: { type: Number, required: true, min: 0 }, // Price of the show
//   },
//   { timestamps: true }
// );

// // Adding an index for faster lookups
// showSchema.index({ movie: 1, theater: 1, date: 1, time: 1 });

// export default mongoose.model('Show', showSchema);

import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // Time of the show, e.g., '09:00 AM'
  price: { type: Number, required: true, min: 0 }, // Price of the show
  seats: [{
    row: { type: String, required: true },
    number: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true }
  }]
},
{ timestamps: true }
);

// Adding an index for faster lookups
showSchema.index({ movie: 1, theater: 1, date: 1, time: 1 });

export default mongoose.model('Show', showSchema);