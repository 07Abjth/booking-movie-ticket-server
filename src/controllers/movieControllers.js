import { cloudinaryInstance } from '../config/cloudinaryConfig.js';
import Movie from '../models/movieModel.js';
// import { body, validationResult } from 'express-validator';



export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    return res.status(200).json({ success: true, data: movies });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



// export const createMovie = [
//   // Validation rules
//   body('title').notEmpty().withMessage('Title is required'),
//   body('description').notEmpty().withMessage('Description is required'),
//   body('releaseDate').notEmpty().withMessage('Release date is required'),
//   body('duration').notEmpty().withMessage('Duration is required'),
//   body('language').notEmpty().withMessage('Language is required'),
//   body('genre').notEmpty().withMessage('Genre is required'),
//   body('director').notEmpty().withMessage('Director is required'),
//   body('cast').notEmpty().withMessage('Cast is required'),
//   body('posterUrl').notEmpty().withMessage('Poster URL is required'),
//   body('reviews').notEmpty().withMessage('Reviews are required'),
//   body('ratings').notEmpty().withMessage('Ratings are required'),

//   // Middleware function to handle the request
//   async (req, res) => {
//     const errors = validationResult(req);

//     // Check if there are validation errors
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ success: false, errors: errors.array() });
//     }

//     try {
//       const {
//         title, description, releaseDate, duration, language, genre, director, cast, posterUrl, reviews, ratings
//       } = req.body;

//       const newMovie = new Movie({
//         title, description, releaseDate, duration, language, genre, director, cast, posterUrl, reviews, ratings
//       });

//       await newMovie.save();

//       return res.status(201).json({ success: true, message: 'Movie created successfully', data: newMovie });
//     } catch (error) {
//       return res.status(400).json({ success: false, message: error.message });
//     }
//   }
// ];



// Create a new movie
export const createMovie = async (req, res) => {
  try {
    const { title, description, releaseDate, duration, language, genre, director, cast } = req.body;

    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);

    const isMovie = await Movie.findOne({ title: title });

    if (isMovie) {
      return res.status(400).json({ message: 'Movie already exists' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Poster image is required' });
    }

    // Upload file to Cloudinary
    const result = await cloudinaryInstance.uploader.upload(req.file.path).catch((error) => {
      console.log(error);
    });

    // Create new movie object
    const newMovie = {
      title,
      description,
      releaseDate,
      duration,
      language,
      genre,
      director,
      cast,
      image: result.url  // Use 'result' to access the uploaded file URL
    };

    console.log('New Movie Object:', newMovie);

    // Check for missing fields
    if (!title || !description || !releaseDate || !duration || !language || !genre || !director || !cast) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Save movie to database
    const movie = new Movie(newMovie);
    await movie.save();

    res.status(201).json({ success: true, data: movie });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get movie by ID
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    return res.status(200).json({ success: true, data: movie });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update movie
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    // Update movie fields
    Object.assign(movie, req.body);

    // Validate updated fields
    if (req.body.posterUrl && typeof req.body.posterUrl !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid poster URL format' });
    }

    await movie.save();
    return res.status(200).json({ success: true, message: 'Movie updated successfully', data: movie });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Delete movie
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    return res.status(200).json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Search movies
export const searchMovies = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    });

    return res.status(200).json({ success: true, data: movies });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
