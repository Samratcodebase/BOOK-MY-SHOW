// ===========================
// MOVIE SERVICE MODULE
// ===========================
// This module handles all movie-related business logic including CRUD operations and search functionality

import mongoose, { Error } from "mongoose";
import Movie from "../Models/movie.model.js";

/**
 * CREATE MOVIE SERVICE
 * Creates a new movie with the provided details
 * @param {Object} data - Movie data containing movieName, description, casts, trailerUrl, language, releaseDate, director, releaseStatus
 * @returns {Promise<Object>} The created movie document
 * @throws {Object} If required fields are missing (400) or movie already exists (409)
 */
const createMovie = async (data) => {
  // Extract movie details from data payload
  const {
    movieName,
    description,
    casts,
    trailerUrl,
    language,
    releaseDate,
    director,
    releaseStatus,
  } = data;

  // Validate required fields
  if (
    !movieName ||
    !description ||
    !Array.isArray(casts) ||
    casts.length === 0 ||
    !trailerUrl ||
    !releaseDate ||
    !director
  ) {
    // Throw 400 error if any required field is missing or invalid
    throw { statusCode: 400, message: "Invalid or missing fields" };
  }

  // Check if movie with same name already exists
  const existingMovie = await Movie.findOne({ movieName });
  if (existingMovie) {
    // Throw 409 Conflict error if movie already exists
    throw { statusCode: 409, message: "Movie already exists" };
  }

  // Create and return new movie document
  return await Movie.create({
    movieName,
    description,
    casts,
    trailerUrl,
    language,
    releaseDate,
    director,
    releaseStatus,
  });
};

/**
 * UPDATE MOVIE SERVICE
 * Updates movie details with provided data (only allowed fields)
 * @param {string} movieID - The MongoDB ObjectId of the movie to update
 * @param {Object} data - Fields to update (will be filtered for allowed fields only)
 * @returns {Promise<Object>} The updated movie document
 * @throws {Error} If movie ID is invalid or movie not found
 */
const updateMovie = async (movieID, data) => {
  // Validate if movie ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(movieID)) {
    throw new Error("Invalid Movie ID");
  }

  // Define allowed fields that can be updated
  const allowedFields = [
    "movieName",
    "description",
    "casts",
    "trailerUrl",
    "language",
    "releaseDate",
    "director",
  ];

  // Filter data to only include allowed fields
  const updatePayload = Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedFields.includes(key))
  );

  // Throw error if no valid fields to update
  if (Object.keys(updatePayload).length === 0) {
    throw new Error("No valid fields to update");
  }

  // Find and update movie, returning new updated document
  const updatedMovie = await Movie.findByIdAndUpdate(movieID, updatePayload, {
    new: true, // return updated doc
    runValidators: true, // enforce schema rules
  });

  if (!updatedMovie) {
    // Throw error if movie not found
    throw new Error("Movie not found");
  }

  // Return the updated movie
  return updatedMovie;
};

/**
 * DELETE MOVIE SERVICE
 * Deletes a movie by its ID
 * @param {string} movieID - The MongoDB ObjectId of the movie to delete
 * @returns {Promise<Object>} The deleted movie document
 * @throws {Error} If movie ID is invalid or movie not found
 */
const deleteMovieById = async (movieID) => {
  // Validate if movie ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(movieID)) {
    throw new Error("Invalid Movie ID");
  }

  // Find and delete movie by ID
  const deletedMovie = await Movie.findByIdAndDelete(movieID);

  if (!deletedMovie) {
    // Throw error if movie not found
    throw new Error("Movie not found");
  }

  // Return the deleted movie
  return deletedMovie;
};

/**
 * GET MOVIES BY NAME SERVICE
 * Searches for movies by name using case-insensitive regex pattern
 * @param {string} movieName - The movie name to search for
 * @returns {Promise<Array>} Array of matching movie documents
 * @throws {Error} If no matching movies found (404)
 */
const getMoviesByName = async (movieName) => {
  // Build filter object using case-insensitive regex search
  const filter = movieName
    ? { movieName: { $regex: movieName, $options: "i" } }
    : {};

  // Query movies with filter
  const movies = await Movie.find(filter);

  if (movies.length === 0) {
    // Throw 404 error if no movies match
    const err = new Error("No Matching Movie Found ");
    err.success = false;
    err.statusCode = 404;
    throw err;
  }

  // Return array of matching movies
  return movies;
};

// Export all movie service functions
export default { createMovie, updateMovie, deleteMovieById, getMoviesByName };
