import Admin from '../models/adminModel.js';
import User from '../models/userModel.js';
import Movie from '../models/movieModel.js';
import Theater from '../models/theaterModel.js';
import Show from '../models/showModel.js';
import TheaterOwner from '../models/theaterOwnerModel.js'; // Make sure this import is correct
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken.js';




// Function to create an admin with parameters
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the provided password

    const admin = new Admin({ name, email, password: hashedPassword, phoneNumber});
await admin.save();


    res.status(201).json({ success: true, message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



//Check admin
export const checkAdmin = async (req, res, next) => {
  try {
    const { email, id } = req.query;

    // Check if user is authenticated (assuming req.user is set in authentication middleware)
    if (!req.user) {
      return res.status(400).json({ success: false, message: "User not authenticated" });
    }

    // Check if the authenticated user has an admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }

    // Search for admin by email or ID
    let admin;
    if (email) {
      admin = await Admin.findOne({ email });
    } else if (id) {
      admin = await Admin.findById(id);
    }

    // If no admin is found, return an error
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    // If admin is found, return success with admin data
    return res.status(200).json({ success: true, data: admin });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};





//AdminLogin
export const loginAdmin = async (req, res) => {
  try {
    // Destructure request body to get login credentials
    const { email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Admin not found' });
    }

    // Check if the password matches
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect password' });
    }

    // Check if the user has the admin role
    if (admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized as admin' });
    }

    // Generate JWT token
    const token = generateToken(admin._id, admin.role);


    // Send token and success message
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });

  } catch (error) {
    // Handle errors
    res.status(500).json({ success: false, message: 'Error logging in: ' + error.message });
  }
};




// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Movie-related functions
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//create movie

// Create a new movie
export const createMovie = async (req, res) => {
  try {
    // Destructure required fields from request body
    const { title, description, releaseDate, duration, language, genre, director, cast } = req.body;

    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);

    // Check if movie already exists
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
      console.log('Cloudinary upload error:', error);
      throw new Error('Cloudinary upload failed');
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
      image: result.url  // URL of the uploaded image
    };

    console.log('New Movie Object:', newMovie);

    // Check for missing fields (can be redundant here as we’ve already destructured the required fields)
    if (!title || !description || !releaseDate || !duration || !language || !genre || !director || !cast) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Save movie to database
    const movie = new Movie(newMovie);
    await movie.save();

    res.status(201).json({ success: true, data: movie });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//update movie

export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (movie) {
      res.json({ message: 'Movie deleted' });
    } else {
      res.status(404).json({ message: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Theater-related functions
export const getTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find();
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTheater = async (req, res) => {
  try {
    const theater = new Theater(req.body);
    await theater.save();
    res.status(201).json(theater);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTheater = async (req, res) => {
  try {
    const theater = await Theater.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (theater) {
      res.json(theater);
    } else {
      res.status(404).json({ message: 'Theater not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTheater = async (req, res) => {
  try {
    const theater = await Theater.findByIdAndDelete(req.params.id);
    if (theater) {
      res.json({ message: 'Theater deleted' });
    } else {
      res.status(404).json({ message: 'Theater not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Theater Owner management


// Delete a theater owner
export const deleteTheaterOwner = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Theater owner not found' });
    }

    return res.status(200).json({ success: true, message: 'Theater owner deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



// Show-related functions
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find().populate('movie').populate('theater');
    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createShow = async (req, res) => {
  try {
    const show = new Show(req.body);
    await show.save();
    res.status(201).json(show);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (show) {
      res.json(show);
    } else {
      res.status(404).json({ message: 'Show not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (show) {
      res.json({ message: 'Show deleted' });
    } else {
      res.status(404).json({ message: 'Show not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
