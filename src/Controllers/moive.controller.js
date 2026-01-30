// ===========================
// MOVIE CONTROLLER MODULE
// ===========================
// This module handles movie-related HTTP request handlers for CRUD operations and search functionality

import Movie from "../Models/movie.model.js";
import MovieService from "../Services/moive.services.js";
import { statusCode } from "../Utils/constant.js";

/**
 * CREATE MOVIES CONTROLLER
 * Handles movie creation request with validation and error handling
 * @param {Object} req - Express request object containing movie data in body
 * @param {Object} res - Express response object
 * @returns {JSON} Response with created movie data
 */
const CreateMovies = async (req, res) => {
  try {
    // Call service to create movie with provided data
    const movie = await MovieService.createMovie(req.body);

    // Return 201 Created status with new movie data
    return res.status(statusCode.CREATED).json({
      success: true,
      message: "Movie created successfully",
      data: movie,
    });
  } catch (error) {
    // Return error response with status code from error or default 500
    return res.status(error.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/**
 * DELETE MOVIE CONTROLLER
 * Handles movie deletion request by ID
 * @param {Object} req - Express request object with movie ID in params
 * @param {Object} res - Express response object
 * @returns {JSON} Response with deleted movie data
 */
const deleteMovie = async (req, res) => {
  try {
    // Extract movie ID from URL parameters
    const { id } = req.params;

    // Validate that movie ID is provided
    if (!id) {
      // Return 400 error if ID is missing
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Movie ID is required",
      });
    }

    // Call service to delete movie by ID
    const deletedMoive = await MovieService.deleteMovieById(id);

    // Return 200 OK with deleted movie data
    return res.status(statusCode.OK).json({
      success: true,
      message: "Movie deleted successfully",
      Data: deletedMoive,
    });
  } catch (error) {
    // Determine status code based on error message
    const code =
      error.message === "Movie not found" ||
      error.message === "Invalid Movie ID"
        ? statusCode.NOT_FOUND
        : statusCode.INTERNAL_SERVER_ERROR;

    // Return error response with appropriate status code
    return res.status(code).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * MOVIES BY NAME CONTROLLER
 * Handles movie search by name (case-insensitive)
 * Supports both GET /movies and GET /movies?movieName=avengers
 * @param {Object} req - Express request object with optional movieName query parameter
 * @param {Object} res - Express response object
 * @returns {JSON} Array of matching movie documents
 */
const MoviesByName = async (req, res) => {
  try {
    // Extract optional movie name from query parameters
    const { movieName } = req.query;

    // Call service to fetch movies matching the search query
    const movies = await MovieService.getMoviesByName(movieName);

    // Return 200 OK with matching movies
    return res.status(statusCode.OK).json({
      success: true,
      message: "Movies fetched successfully",
      data: movies,
    });
  } catch (error) {
    // Return error response with status code and message from service
    return res.status(error.statusCode).json({
      success: error.success,
      message: error.message,
    });
  }
};

/**
 * GET MOVIE BY ID CONTROLLER
 * Placeholder function for retrieving a single movie by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @todo Implement this function to fetch a specific movie by ID
 */
const getMovieByID = async (req, res) => {
  // TODO: Implement single movie retrieval by ID
};

/**
 * UPDATE MOVIE CONTROLLER
 * Handles movie details update request
 * @param {Object} req - Express request object with {id, data} in body
 * @param {Object} res - Express response object
 * @returns {JSON} Response with updated movie data
 */
const updateMovie = async (req, res) => {
  try {
    // Extract movie ID and update data from request body
    const { id, data } = req.body;

    // Validate that both ID and data are provided
    if (!id || !data) {
      // Return 400 error if required fields are missing
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: "Movie ID and data are required",
      });
    }

    // Call service to update movie with provided data
    const updatedMovie = await MovieService.updateMovie(id, data);

    // Return 200 OK with updated movie data
    return res.status(statusCode.OK).json({
      success: true,
      message: "Movie updated successfully",
      data: updatedMovie,
    });
  } catch (error) {
    // Return 500 error with error message
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

// Export all movie controller functions
export { CreateMovies, MoviesByName, deleteMovie, updateMovie };
