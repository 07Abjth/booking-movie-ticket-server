import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, minlength: 5, maxlength: 100 },
    password: { type: String, required: true, minlength: 8 },
    phoneNumber: { type: String, required: true, minlength: 10, maxlength: 15 },
    address: { type: String, maxlength: 200 },
    role: {
      type: String,
      enum: ['user', 'admin', 'theater_owner'],  // Defining different roles
      default: 'user',  // Default role is 'user'
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
