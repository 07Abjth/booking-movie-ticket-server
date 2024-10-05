// import mongoose from 'mongoose';

// const paymentSchema = new mongoose.Schema(
//   {
//     booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
//     stripePaymentId: { type: String, required: true }, // Stripe payment ID
//     amount: { type: Number, required: true },
//     paymentDate: { type: Date, default: Date.now },
//     status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.model('Payment', paymentSchema);
