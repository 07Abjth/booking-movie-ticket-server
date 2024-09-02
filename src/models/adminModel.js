// import mongoose from 'mongoose';

// const adminSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, minlength: 2, maxlength: 50 },
//     email: { 
//       type: String, 
//       required: true, 
//       unique: true, 
//       minlength: 5, 
//       maxlength: 100, 
//       match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'] 
//     },
//     password: { type: String, required: true, minlength: 6, maxlength: 100 },
//     role: { type: String, enum: ['admin'], default: 'admin' },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model('Admin', adminSchema);


import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ['admin'], // Fixed role
    default: 'admin', // Default value
  },
  permissions: {
    type: [String], // Example: ['manage-users', 'approve-theaters', 'view-reports']
    default: ['manage-users', 'approve-theaters', 'view-reports'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', // Reference to another admin who created this account
  },
  logs: [
    {
      action: { type: String }, // What action was taken
      timestamp: { type: Date, default: Date.now }, // When the action was taken
    },
  ],
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 15,
  },
  address: {
    type: String,
    maxlength: 200,
  },
}, { timestamps: true });

export default mongoose.model('Admin', adminSchema);
