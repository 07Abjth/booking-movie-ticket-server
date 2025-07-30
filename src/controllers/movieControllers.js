import { cloudinaryInstance } from '../config/cloudinaryConfig.js';
import Movie from '../models/movieModel.js';
import Theater from '../models/theaterModel.js'; // ✅ FIX: Import the missing model
import fs from 'fs';

// Create a new movie
export const createMovie = async (req, res) => {
  try {
    const { 
      title, description, releaseDate, duration, language, genre, director, cast, 
      trending = false, upcoming = false, isNewRelease = false,
      avgRating = 0, totalRatings = 0 
    } = req.body;

    if (!title || !description || !releaseDate || !duration || !language || !genre || !director || !cast) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Poster image is required' });
    }

    let cloudinaryResult;
    try {
      cloudinaryResult = await cloudinaryInstance.uploader.upload(req.file.path);
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      return res.status(500).json({ success: false, message: 'Image upload failed' });
    }

    const newMovie = new Movie({
      title,
      description,
      releaseDate: new Date(releaseDate),
      duration: parseInt(duration, 10),
      language,
      genre: Array.isArray(genre) ? genre : genre.split(',').map(g => g.trim()),
      director,
      cast: Array.isArray(cast) ? cast : cast.split(',').map(c => c.trim()),
      image: cloudinaryResult.secure_url,
      trending: trending === 'true' || trending === true,
      upcoming: upcoming === 'true' || upcoming === true,
      isNewRelease: isNewRelease === 'true' || isNewRelease === true,
      avgRating: parseFloat(avgRating),
      totalRatings: parseInt(totalRatings, 10)
    });

    await newMovie.save();

    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    return res.status(201).json({ success: true, data: newMovie });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update movie
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }
    Object.assign(movie, req.body);
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

// Get upcoming movies
export const getUpcomingMovies = async (req, res) => {
  try {
    const upcomingMovies = await Movie.find({ upcoming: true });
    return res.status(200).json({ success: true, data: upcomingMovies });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get trending movies
export const getTrendingMovies = async (req, res) => {
  try {
    const trendingMovies = await Movie.find({ trending: true });
    return res.status(200).json({ success: true, data: trendingMovies });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get new releases
export const getNewReleases = async (req, res) => {
  try {
    const newReleases = await Movie.find({ isNewRelease: true });
    return res.status(200).json({ success: true, data: newReleases });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get theaters by movie ID
export const getTheatersByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    if (!movieId) {
      return res.status(400).json({ success: false, message: 'Movie ID is required' });
    }
    const theaters = await Theater.find({ movies: movieId });
    if (!theaters || theaters.length === 0) {
      return res.status(404).json({ success: false, message: 'No theaters found for this movie' });
    }
    return res.status(200).json({ success: true, data: theaters });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    return res.status(200).json({ success: true, data: movies });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Basic movie info by ID
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId).select("title releaseDate genre");
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    return res.status(200).json({ success: true, data: movie });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Detailed movie info by ID
export const getMovieDetails = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    return res.status(200).json({ success: true, data: movie });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching movie details', error });
  }
};
