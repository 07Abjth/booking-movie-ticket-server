import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 1, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    releaseDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    language: { type: String, required: true, minlength: 2, maxlength: 50 },
    genre: [{ type: String, maxlength: 50 }],
    director: { type: String, required: true, minlength: 2, maxlength: 100 },
    cast: [{ type: String, maxlength: 100 }],
    image: { type: String, maxlength: 200 },
    avgRating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    trending: { type: Boolean, default: false },
    upcoming: { type: Boolean, default: false },
    isNewRelease: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Movie', movieSchema);
