// // import mongoose from "mongoose";

// // const theaterSchema = new mongoose.Schema(
// //   {
// //     name: { type: String, required: true },
// //     location: { type: String, required: true },
// //     screens: [{
// //       screenNumber: { type: Number, required: true },
// //       screenType: { type: String, required: true },
// //       seatLayout: [{ 
// //         row: { type: String, required: true },
// //         number: { type: Number, required: true },
// //         type: { type: String } // e.g., 'Regular', 'Premium'
// //       }]
// //     }],
// //     movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }], // Reference to movies
// //     showtimes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Show' }] // Reference to showtimes
// //   },
// //   { timestamps: true }
// // );

// // export default mongoose.model('Theater', theaterSchema);

// import mongoose from 'mongoose';

// const theaterSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   location: { type: String, required: true },
//   screens: [{
//     screenNumber: { type: Number, required: true },
//     screenType: { type: String, required: true },
//     seatLayout: [{
//       row: { type: String, required: true }, // Row identifier (A, B, C, etc.)
//       number: { type: Number, required: true }, // Individual seat number
//       type: { type: String, required: true } // e.g., 'Regular', 'Premium'
//     }]
//   }],
//   movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }], // Reference to movies
//   showtimes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Show' }] // Reference to showtimes
// }, 
// { timestamps: true });

// export default mongoose.model('Theater', theaterSchema);
// mongoose.model('Theater', theaterSchema);


 import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema({
  screenNumber: { type: Number, required: true },
  screenType: { type: String, required: true },
  // Removed seatLayout as seats are now defined in the Seat model
}, { _id: false }); // Prevent creating separate _id for each screen

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  screens: [screenSchema], // Embedded documents for screens
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  showtimes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Show' }]
}, 
{ timestamps: true });

export default mongoose.model('Theater', theaterSchema);
