import express from "express";
import bookingController from "../Controllers/booking.controller.js";
import bookingMiddleware from "../Middleware/booking.middleware.js";
import AuthMiddleware from "../Middleware/auth.middleware.js";
const router = express.Router();

router.post(
  "/booking",
  AuthMiddleware.isAuthenticated,
  bookingMiddleware.validateBookingRequest,
  bookingController.createBooking,
);

export default router;
