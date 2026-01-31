// ===========================
// MOVIE ROUTES MODULE
// ===========================
// This module defines all movie-related API endpoints for CRUD operations and search functionality

import express from "express";
import {
  CreateMovies,
  MoviesByName,
  deleteMovie,
  updateMovie,
} from "../Controllers/moive.controller.js";
import authMiddleware from "../Middleware/auth.middleware.js";

// Initialize Express router
const router = express.Router();

/**
 * POST /movies - Create a new movie
 * Request body: movieName, description, casts, trailerUrl, language, releaseDate, director, releaseStatus
 * Response: Created movie document
 */
router.post("/movies", CreateMovies);

/**
 * GET /movies - Search movies by name
 * Query parameters: movieName (optional, case-insensitive search)
 * Response: Array of matching movie documents
 */
router.get("/movies", authMiddleware.isAuthenticated, MoviesByName);

/**
 * DELETE /movies/:id - Delete a movie by ID
 * URL parameter: id (MongoDB ObjectId)
 * Response: Deleted movie document
 */
router.delete("/movies/:id", deleteMovie);

/**
 * PATCH /update - Update movie details
 * Request body: movieID and fields to update (movieName, description, casts, trailerUrl, language, releaseDate, director)
 * Response: Updated movie document
 */
router.patch("/update", updateMovie);

// Export router with all movie routes
export default router;
