import mongoose from 'mongoose';

const theaterOwnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 100
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['theater-owner'], // Enum values
    default: 'theater-owner' // Default value
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 15
  },
  address: {
    type: String,
    maxlength: 200
  }
}, { timestamps: true });

export default mongoose.model('TheaterOwner', theaterOwnerSchema);
