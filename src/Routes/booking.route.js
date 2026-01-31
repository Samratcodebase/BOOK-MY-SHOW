import express from "express";
import bookingController from "../Controllers/booking.controller.js";
import AuthMiddleware from "../Middleware/auth.middleware.js";
const router = express.Router();

router.post(
  "/booking",
  AuthMiddleware.isAuthenticated,
  bookingController.createBooking,
);

export default router;
