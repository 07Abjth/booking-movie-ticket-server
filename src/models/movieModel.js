import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 1, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    releaseDate: { type: Date, required: true },
    duration: { type: Number, required: true }, // duration in minutes
    language: { type: String, required: true, minlength: 2, maxlength: 50 },
    genre: [{ type: String, maxlength: 50 }], // Array of genres, e.g., ["Action", "Comedy"]
    director: { type: String, required: true, minlength: 2, maxlength: 100 },
    cast: [{ type: String, maxlength: 100 }], // Array of cast members' names
    image: { type: String, maxlength: 200 }, // URL to the movie poster image
    ratings: {
      type: Number,
      min: 0,
      max: 10,
      default: 0, // Rating out of 10
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Movie', movieSchema);





    // image:{
    //     type:String, 
    //     default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqHjPX-GKYEX9yXi4ySoXIjTKiX2xBMrfwbQ&s"
    // },



