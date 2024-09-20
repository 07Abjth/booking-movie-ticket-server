// import mongoose from "mongoose";

// const theaterSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     location: { type: String, required: true },
//     screens: [{
//       screenNumber: { type: Number, required: true },
//       screenType: { type: String, required: true },
//       seatLayout: [{ 
//         row: { type: String, required: true },
//         number: { type: Number, required: true },
//         type: { type: String } // e.g., 'Regular', 'Premium'
//       }]
//     }],
//     movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }], // Reference to movies
//     showtimes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Show' }] // Reference to showtimes
//   },
//   { timestamps: true }
// );

// export default mongoose.model('Theater', theaterSchema);

import mongoose from 'mongoose';

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  screens: [{
    screenNumber: { type: Number, required: true },
    screenType: { type: String, required: true },
    seatLayout: [{
      row: { type: String, required: true },
      number: { type: Number, required: true },
      type: { type: String } // e.g., 'Regular', 'Premium'
    }]
  }],
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }], // Reference to movies
  showtimes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Show' }] // Reference to showtimes
},
{ timestamps: true }
);

export default mongoose.model('Theater', theaterSchema);