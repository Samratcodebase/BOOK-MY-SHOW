// ===========================
// EXPRESS APPLICATION MODULE
// ===========================
// This module initializes and configures the Express application with middleware, CORS, and API routes

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import HealthCheckRouter from "./Routes/healthCheck.route.js";
import MoiveBookingRouter from "./Routes/moive.route.js";
import TheatreRouter from "./Routes/theatre.route.js";
import UserRouter from "./Routes/user.route.js";

// Initialize Express application
const app = express();

/**
 * CORS CONFIGURATION
 * Configures Cross-Origin Resource Sharing to allow requests from specified origins
 * Allows specific HTTP methods and headers for cross-origin requests
 */
const corsOptions = {
  // Allow requests from frontend applications on these origins
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  // Allow credentials (cookies, authorization headers) in cross-origin requests
  credentials: true,
  // Allow these HTTP methods in cross-origin requests
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  // Allow these headers in cross-origin requests
  allowedHeaders: ["Content-Type", "Authorization"],
  // HTTP status code for successful OPTIONS requests
  optionsSuccessStatus: 200,
};

/**
 * MIDDLEWARE CONFIGURATION
 * Setup global middleware for request processing
 */
// Enable CORS with configured options
app.use(cors(corsOptions));
// Parse incoming JSON request bodies
app.use(express.json());
// Parse incoming URL-encoded request bodies (form data)
app.use(express.urlencoded({ extended: true }));
// Parse Cookie header and populate req.cookies
app.use(cookieParser());
/**
 * API ROUTES REGISTRATION
 * Mount route handlers for different API endpoints
 */
// Health check endpoint - verify API server status
app.use("/api/v1/heath", HealthCheckRouter);
// Movie booking endpoints - create, read, update, delete movies
app.use("/api/v1/mba", MoiveBookingRouter);
// Theatre endpoints - manage theatres and movie showings
app.use("/api/v1/mba", TheatreRouter);
// User authentication endpoints - signup and login
app.use("/api/v1/auth", UserRouter);

// Export configured Express application
export default app;
