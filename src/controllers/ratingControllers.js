import Rating from '../models/ratingModel.js'; 

// Create a new rating
export const createRating = async (req, res) => {
    try {
        const { userId, rating } = req.body;
        if (![1, 2, 3, 4, 5].includes(rating)) {
            return res.status(400).json({ message: 'Invalid rating value' });
        }

        const newRating = new Rating({ userId, rating });
        await newRating.save();
        res.status(201).json(newRating);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get ratings for a specific movie or user
export const getRatings = async (req, res) => {
    try {
        const { movieId, userId } = req.query;

        if (movieId) {
            // Fetch ratings for a specific movie
            const ratings = await Rating.find({ movieId });
            res.status(200).json(ratings);
        } else if (userId) {
            // Fetch ratings by a specific user
            const ratings = await Rating.find({ userId });
            res.status(200).json(ratings);
        } else {
            // Fetch all ratings
            const ratings = await Rating.find();
            res.status(200).json(ratings);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a rating
export const updateRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const { rating } = req.body;

        if (![1, 2, 3, 4, 5].includes(rating)) {
            return res.status(400).json({ message: 'Invalid rating value' });
        }

        const updatedRating = await Rating.findByIdAndUpdate(ratingId, { rating }, { new: true });
        if (!updatedRating) {
            return res.status(404).json({ message: 'Rating not found' });
        }
        res.status(200).json(updatedRating);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a rating
export const deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.params;

        const deletedRating = await Rating.findByIdAndDelete(ratingId);
        if (!deletedRating) {
            return res.status(404).json({ message: 'Rating not found' });
        }
        res.status(200).json({ message: 'Rating deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
