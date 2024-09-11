import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2, maxlength: 50 },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      minlength: 5, 
      maxlength: 100, 
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'] 
    },
    password: { type: String, required: true, minlength: 6, maxlength: 100 },
    role: { type: String, enum: ['admin'], default: 'admin' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Admin', adminSchema);


