import express from "express";
import { getSessionStatus, getBookingsBySession } from "../../controllers/bookingControllers.js";
// import { authMiddleware } from "../middlewares/authMiddleware.js"; //  

const router = express.Router();

// Route to check payment session status and create booking
router.get("/session-status",  getSessionStatus);

// Route to fetch booking details by session ID
router.get("/bookings",   getBookingsBySession);

export default router;
