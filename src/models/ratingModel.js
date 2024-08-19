import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    rating:{
        type:Number,
        enum:[1,2,3,4,5]
    },
    
});

export default mongoose.model('Rating', ratingSchema);
