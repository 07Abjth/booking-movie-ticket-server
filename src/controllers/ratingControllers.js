import Rating from '../models/ratingModel.js';
import Movie from '../models/movieModel.js';

// Create a new rating
export const createRating = async (req, res) => {
    try {
        const { userId, movieId, rating } = req.body;

        // Validate rating value
        if (![1, 2, 3, 4, 5].includes(rating)) {
            return res.status(400).json({ message: 'Invalid rating value' });
        }

        // Validate movieId
        if (!movieId) {
            return res.status(400).json({ message: 'Movie ID is required' });
        }

        // Check if the user has already rated the movie
        const existingRating = await Rating.findOne({ userId, movieId });
        if (existingRating) {
            return res.status(400).json({ message: 'User has already rated this movie' });
        }

        // Create and save the new rating
        const newRating = new Rating({ userId, movieId, rating });
        await newRating.save();

        // Fetch the movie and update its average rating and total ratings
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const totalRatings = movie.totalRatings + 1;
        const newAvgRating = (movie.avgRating * movie.totalRatings + rating) / totalRatings;

        movie.avgRating = newAvgRating;
        movie.totalRatings = totalRatings;
        await movie.save();

        res.status(201).json({ newRating, avgRating: movie.avgRating });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get ratings for a specific movie or user, with movie details
export const getRatings = async (req, res) => {
    try {
        const { movieId, userId } = req.query;

        let ratings;

        if (movieId) {
            // Fetch ratings for a specific movie and populate movie details
            ratings = await Rating.find({ movieId }).populate('movieId', 'name');
        } else if (userId) {
            // Fetch ratings by a specific user and populate movie details
            ratings = await Rating.find({ userId }).populate('movieId', 'name');
        } else {
            // Fetch all ratings and populate movie details
            ratings = await Rating.find().populate('movieId', 'name');
        }

        // Log the ratings data
        console.log('Ratings Data:', JSON.stringify(ratings, null, 2));

        res.status(200).json(ratings);
    } catch (error) {
        // Log the error message
        console.error('Error Fetching Ratings:', error.message);
        res.status(500).json({ message: error.message });
    }
};


//Update rating
export const updateRating = async (req, res) => {
    try {
        const { id } = req.params;  // The ID of the rating document to update
        const { rating } = req.body; // The new rating value

        console.log('Update Rating - ID:', id); // Log the ID received
        console.log('Update Rating - New Rating:', rating); // Log the new rating value

        // Validate rating value
        if (![1, 2, 3, 4, 5].includes(rating)) {
            return res.status(400).json({ message: 'Invalid rating value' });
        }

        // Find the existing rating
        const existingRating = await Rating.findById(id);  // Use 'id' here
        if (!existingRating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        // Update the rating and save it
        const oldRatingValue = existingRating.rating;
        existingRating.rating = rating;
        await existingRating.save();

        // Update the movie's average rating
        const movie = await Movie.findById(existingRating.movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const totalRatings = movie.totalRatings;
        const newAvgRating = (movie.avgRating * totalRatings - oldRatingValue + rating) / totalRatings;

        movie.avgRating = newAvgRating;
        await movie.save();

        res.status(200).json({ updatedRating: existingRating, avgRating: movie.avgRating });
    } catch (error) {
        console.error('Update Rating Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};


// Delete a rating
export const deleteRating = async (req, res) => {
    try {
        const { id } = req.params; // Ensure 'id' matches the route parameter

        // Find the rating to delete
        const deletedRating = await Rating.findByIdAndDelete(id); // Check for correct 'id'
        if (!deletedRating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        // Update the movie's average rating after deleting the rating
        const movie = await Movie.findById(deletedRating.movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const totalRatings = movie.totalRatings - 1;
        const newAvgRating = totalRatings > 0
            ? (movie.avgRating * movie.totalRatings - deletedRating.rating) / totalRatings
            : 0;

        movie.avgRating = newAvgRating;
        movie.totalRatings = totalRatings;
        await movie.save();

        res.status(200).json({ message: 'Rating deleted successfully', avgRating: movie.avgRating });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};