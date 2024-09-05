import { cloudinaryInstance } from '../config/cloudinaryConfig.js';
import Movie from '../models/movieModel.js';
 


  
// Create a new movie
 export const createMovie = async (req, res) => {
  try {
    console.log('Request Received');
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);

    const { 
      title, 
      description, 
      releaseDate, 
      duration, 
      language, 
      genre, 
      director, 
      cast, 
      trending = false, 
      upcoming = false, 
      isNewRelease = false,
      avgRating = 0,  
      totalRatings = 0  
    } = req.body;

    // Check if movie already exists
    const existingMovie = await Movie.findOne({ title });
    console.log('Existing Movie Check:', existingMovie);

    if (existingMovie) {
      console.log('Movie already exists');
      return res.status(400).json({ success: false, message: 'Movie already exists' });
    }

    // Validate required fields
    if (!title || !description || !releaseDate || !duration || !language || !genre || !director || !cast) {
      console.log('Missing required fields');
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }

    // Check if file was uploaded
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ success: false, message: 'Poster image is required' });
    }

    // Upload file to Cloudinary
    const cloudinaryResult = await cloudinaryInstance.uploader.upload(req.file.path);
    console.log('Cloudinary Upload Result:', cloudinaryResult);

    // Create new movie object
    const newMovie = {
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
    };

    console.log('New Movie Object:', newMovie);

    // Save movie to the database
    const movie = new Movie(newMovie);
    await movie.save();
    console.log('Movie saved successfully');

    return res.status(201).json({ success: true, data: movie });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};



//Get all movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    return res.status(200).json({ success: true, data: movies });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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
    const trendingMovies = await Movie.find({ trending: true }); // Ensure 'trending' field matches
    if (trendingMovies.length === 0) {
      return res.status(404).json({ success: true, data: [] }); // No data found
    }
    return res.status(200).json({ success: true, data: trendingMovies });
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch trending movies' });
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
