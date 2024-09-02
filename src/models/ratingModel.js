import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  movieId: {
    type: mongoose.Types.ObjectId,
    ref: "Movie",  
    required: true,
  },
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true,
  },
});

export default mongoose.model('Rating', ratingSchema);
