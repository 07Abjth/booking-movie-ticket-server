import mongoose from "mongoose";

const showSeatAvailabilitySchema = new mongoose.Schema({
    show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
    seat: { type: mongoose.Schema.Types.ObjectId, ref: 'TheaterSeat', required: true },
    status: { type: String, enum: ['available', 'booked'], required: true },
    price: { type: Number, required: true },
  });
  
   
  export default mongoose.model(' ShowSeatAvailability', showSeatAvailabilitySchema);
