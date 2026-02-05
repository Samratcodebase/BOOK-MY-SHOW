// Import Express to create a router instance
import express from "express";

// Controller responsible for handling booking-related business logic
import bookingController from "../Controllers/booking.controller.js";

// Middleware to validate booking request payload (seats, showId, etc.)
import bookingMiddleware from "../Middleware/booking.middleware.js";

// Authentication middleware to ensure the user is logged in
import AuthMiddleware from "../Middleware/auth.middleware.js";

// Create a new router instance for booking routes
const router = express.Router();

// POST /booking
// Creates a new booking
// Flow:
// 1. AuthMiddleware.isAuthenticated → blocks unauthenticated users
// 2. validateBookingRequest → ensures request body is valid before DB hit
// 3. createBooking → executes booking logic and persists data
router.post(
  "/booking",
  AuthMiddleware.isAuthenticated,
  bookingMiddleware.validateBookingRequest,
  bookingController.createBooking,
);

// Export router to be mounted in the main app
export default router;
