// ===========================
// THEATRE ROUTES MODULE
// ===========================
// This module defines all theatre-related API endpoints for CRUD operations and movie management

import {
  createTheatre,
  getTheatres,
  deleteTheatres,
  theatreMoviesController,
  updateTheatre,
  moviesInTheatre,
} from "../Controllers/theatre.controller.js";
import AuthMiddleware from "../Middleware/auth.middleware.js";
import express from "express";

// Initialize Express router
const router = express.Router();

/**
 * GET /theatres - Fetch all theatres with filters
 * POST /theatres - Create a new theatre
 */
router
  .route("/theatres")
  .get(AuthMiddleware.isAuthenticated, getTheatres)
  .post(createTheatre);

/**
 * PATCH /theatres/:id - Update theatre details (name, description, etc.)
 * DELETE /theatres/:id - Delete a theatre by ID
 */
router.route("/theatres/:id").patch(updateTheatre).delete(deleteTheatres);

/**
 * GET /theatres/:id/movies - Get all movies in a specific theatre
 * Optionally filter by specific movie ID via query parameters
 */
router.route("/theatres/:id/movies").get(moviesInTheatre);

/**
 * PATCH /theatres/:id/add/movies - Add/remove movies in a theatre
 * Supports both adding and removing movies based on request body
 */
router.patch("/theatres/:id/add/movies", theatreMoviesController);

// Export router with all theatre routes
export default router;
