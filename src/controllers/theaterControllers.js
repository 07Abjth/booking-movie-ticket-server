import Theater from '../models/theaterModel.js';
import Movie from '../models/movieModel.js';
import Seat from '../models/seatModel.js';  


// Get all theaters or filter by location
export const getTheaters = async (req, res) => {
  try {
    const { location } = req.query;

    // Build query object
    const query = {};
    if (location) {
      query.location = location;
    }

    // Fetch theaters based on the query
    const theaters = await Theater.find(query);
    res.status(200).json({ success: true, data: theaters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//Create theater
export const createTheater = async (req, res) => {
  try {
    const { name, location, screens } = req.body;

    // Validate screens array
    if (!Array.isArray(screens) || screens.length === 0) {
      return res.status(400).json({ success: false, message: "Valid number of screens is required" });
    }

    // Create the theater
    const theater = new Theater({ name, location, screens });
    await theater.save();

    // Loop through each screen to create seats
    for (const screen of screens) {
      const { seatLayout, screenNumber, screenType } = screen;

      // Check for seat layout
      if (!seatLayout || seatLayout.length === 0) {
        return res.status(400).json({ success: false, message: "Seat layout is required for each screen" });
      }

      // Create seats based on the seat layout
      for (const layout of seatLayout) {
        const { row, number, type } = layout;

        // Loop through the number of seats defined in the layout
        for (let seatNumber = 1; seatNumber <= number; seatNumber++) {
          await Seat.create({
            theater: theater._id,
            row, // Use the row directly
            seatNumber: `${row}${seatNumber}`, // Example seat number: A1, A2, etc.
            type: type || 'Regular', // Default to 'Regular' if not specified
            status: 'available', // Seats are available by default
            price: type === 'Premium' ? 200 : 100 // Example pricing logic based on seat type
          });
        }
      }
    }

    res.status(201).json({ success: true, data: theater });
  } catch (error) {
    console.error("Error creating theater:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTheaterDetails = async (req, res) => {
  try {
    const { theaterId } = req.params; // Get theaterId from the URL parameters

    // Validate the theaterId
    if (!theaterId) {
      return res.status(400).json({ success: false, message: 'Theater ID is required' });
    }

    // Find the theater by ID
    const theater = await Theater.findById(theaterId);

    if (!theater) {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }

    res.status(200).json({ success: true, data: theater });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update an existing theater
export const updateTheater = async (req, res) => {
  try {
    const { theaterId } = req.params;
    const { name, location, screens } = req.body;

    const updatedTheater = await Theater.findByIdAndUpdate(
      theaterId,
      { name, location, screens },
      { new: true }
    );

    if (!updatedTheater) {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }

    res.status(200).json({ success: true, data: updatedTheater });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a theater
export const deleteTheater = async (req, res) => {
  try {
    const { theaterId } = req.params;

    const deletedTheater = await Theater.findByIdAndDelete(theaterId);

    if (!deletedTheater) {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }

    res.status(200).json({ success: true, message: 'Theater deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// Get a specific theater by ID
export const getTheaterById = async (req, res) => {
  try {
    const theater = await Theater.findById(req.params.id); // This gets the ID from URL params
    if (theater) {
      return res.status(200).json({ success: true, data: theater });
    } else {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get theaters by location
export const getTheatersByLocation = async (req, res) => {
  try {
    const { location } = req.params;

    const theaters = await Theater.find({ location });
    if (theaters.length > 0) {
      return res.status(200).json({ success: true, data: theaters });
    } else {
      return res.status(404).json({ success: false, message: 'No theaters found for this location' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Add movies to a theater
export const addMoviesToTheater = async (req, res) => {
  try {
    const { theaterId } = req.params;
    const { movieIds } = req.body;

    // Ensure movieIds is an array and theaterId is valid
    if (!Array.isArray(movieIds) || movieIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Valid movieIds array is required' });
    }

    // Find the theater by ID
    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return res.status(404).json({ success: false, message: 'Theater not found' });
    }

    // Validate that all movieIds exist
    const movies = await Movie.find({ _id: { $in: movieIds } });
    if (movies.length !== movieIds.length) {
      return res.status(400).json({ success: false, message: 'One or more movies not found' });
    }

    // Add movies to the theater's movie list
    theater.movies = [...new Set([...theater.movies, ...movieIds])]; // Avoid duplicates
    await theater.save();

    res.status(200).json({ success: true, message: 'Movies added to theater successfully', data: theater });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Fetch theaters by an array of Theater IDs
export const getTheatersByIds = async (req, res) => {
  const { theaterIds } = req.body;  // Extract theater IDs from the request body

  if (!Array.isArray(theaterIds) || theaterIds.length === 0) {
    return res.status(400).json({ error: 'Invalid input: theaterIds should be a non-empty array.' });
  }

  try {
    const theaters = await Theater.find({ _id: { $in: theaterIds } });
    return res.status(200).json(theaters);
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while fetching theaters.' });
  }
};


export const getTheatersByMovieId = async (req, res) => {
  const { movieId } = req.params;

  try {
    // Fetch shows associated with the movieId
    const shows = await Show.find({ movie: movieId }).select('theater');

    // Extract unique theater IDs from shows
    const theaterIds = [...new Set(shows.map(show => show.theater))];

    // Fetch theaters based on the extracted IDs
    const theaters = await Theater.find({ _id: { $in: theaterIds } });

    res.status(200).json(theaters);
  } catch (error) {
    console.error('Error fetching theaters:', error);
    res.status(500).json({ message: 'Error fetching theaters' });
  }
};


 