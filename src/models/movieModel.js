// import mongoose from "mongoose";

// const movieSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true, minlength: 1, maxlength: 100 },
//     description: { type: String, maxlength: 500 },
//     releaseDate: { type: Date, required: true },
//     duration: { type: Number, required: true },
//     language: { type: String, required: true, minlength: 2, maxlength: 50 },
//     genre: [{ type: String, maxlength: 50 }],
//     director: { type: String, required: true, minlength: 2, maxlength: 100 },
//     cast: [{ type: String, maxlength: 100 }],
//     image: { type: String, maxlength: 200 },
//     avgRating: {
//       type: Number,
//       min: 0,
//       max: 10,
//       default: 0,
//     },
//     totalRatings: {
//       type: Number,
//       default: 0,
//     },
//     trending: { type: Boolean, default: false },
//     upcoming: { type: Boolean, default: false },
//     isNewRelease: { type: Boolean, default: false },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model('Movie', movieSchema);


// import mongoose from "mongoose";

// const movieSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       minlength: 1,
//       maxlength: 100,
//       trim: true, // Ensures no leading/trailing spaces
//     },
//     description: {
//       type: String,
//       maxlength: 500,
//       trim: true,
//     },
//     releaseDate: {
//       type: Date,
//       required: true,
//     },
//     duration: {
//       type: Number,
//       required: true,
//       min: 1, // Ensures a valid positive duration
//     },
//     language: {
//       type: String,
//       required: true,
//       minlength: 2,
//       maxlength: 50,
//       trim: true,
//     },
//     genre: [
//       {
//         type: String,
//         maxlength: 50,
//         trim: true,
//       }
//     ],
//     director: {
//       type: String,
//       required: true,
//       minlength: 2,
//       maxlength: 100,
//       trim: true,
//     },
//     cast: [
//       {
//         type: String,
//         maxlength: 100,
//         trim: true,
//       }
//     ],
//     image: {
//       type: String,
//       maxlength: 200,
//       default: 'default-image.jpg', // Placeholder image if none is provided
//     },
//     avgRating: {
//       type: Number,
//       min: 0,
//       max: 10,
//       default: 0,
//       set: (v) => Math.round(v * 10) / 10, // Rounds to 1 decimal place
//     },
//     totalRatings: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//     trending: {
//       type: Boolean,
//       default: false,
//     },
//     upcoming: {
//       type: Boolean,
//       default: false,
//     },
//     isNewRelease: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Adding indexes for efficient queries
// movieSchema.index({ title: 1 });
// movieSchema.index({ releaseDate: -1 });
// movieSchema.index({ trending: 1 });
// movieSchema.index({ upcoming: 1 });

// export default mongoose.model('Movie', movieSchema);



import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
    trim: true
  },
  description: {
    type: String,
    maxlength: 500,
    trim: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  language: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true
  },
  genre: [
    {
      type: String,
      maxlength: 50,
      trim: true
    }
  ],
  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
    trim: true
  },
  cast: [
    {
      type: String,
      maxlength: 100,
      trim: true
    }
  ],
  image: {
    type: String,
    maxlength: 200,
    default: 'default-image.jpg'
  },
  avgRating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
    set: (v) => Math.round(v * 10) / 10
  },
  totalRatings: {
    type: Number,
    default: 0,
    min: 0
  },
  trending: {
    type: Boolean,
    default: false
  },
  upcoming: {
    type: Boolean,
    default: false
  },
  isNewRelease: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
});

// Adding indexes for efficient queries
movieSchema.index({ title: 1 });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ trending: 1 });
movieSchema.index({ upcoming: 1 });

export default mongoose.model('Movie', movieSchema);