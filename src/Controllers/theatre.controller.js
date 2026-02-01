// ===========================
// THEATRE CONTROLLER MODULE
// ===========================
// This module handles theatre-related HTTP request handlers for CRUD operations and movie management

import theatreService from "../Services/theatre.services.js";
import moiveServices from "../Services/moive.services.js";
import { statusCode } from "../Utils/constant.js";

/**
 * CREATE THEATRE CONTROLLER
 * Handles theatre creation request
 * @param {Object} req - Express request object containing {name, description, city, pincode, address} in body
 * @param {Object} res - Express response object
 * @returns {JSON} Response with theatre creation status
 */
const createTheatre = async (req, res) => {
  try {
    // Extract theatre details from request body
    const { name, description, city, pincode, address } = req.body;

    // Validate that all required fields are provided
    if (!name || !description || !city || !pincode || !address) {
      // Return 400 error if any required field is missing
      res.status(statusCode.BAD_REQUEST).json({
        message: "All fileds are required",
        sucess: false,
      });
    }

    // Call service to create theatre in database
    const Theatre = await theatreService.createTheatre({
      name,
      description,
      city,
      pincode,
      address,
    });

    if (!Theatre) {
      // Return 500 error if theatre creation fails
      res.status(statusCode.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        sucess: false,
      });
    }

    // Return 201 Created status with success message
    return res.status(statusCode.CREATED).json({
      message: "Theater Creation SucessFull",
      sucess: true,
    });
  } catch (error) {
    // Return 500 error with error message
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      sucess: true,
    });
  }
};

/**
 * GET THEATRES CONTROLLER
 * Handles theatre retrieval with optional filtering by name, city, pincode, or movie
 * @param {Object} req - Express request object with query parameters
 * @param {Object} res - Express response object
 * @returns {JSON} Array of theatre documents matching filters
 */
const getTheatres = async (req, res) => {
  try {
    // Initialize empty query object for building dynamic filters
    let query = {};
    // Extract filter parameters from query string
    const { name, city, pincode } = req.query;
    let movie = req.query.movie;

    // Build query object based on provided filters
    if (name) {
      query.name = name;
    }
    if (city) {
      query.city = city;
    }
    if (pincode) {
      query.pincode = pincode;
    }

    // If movie filter provided, fetch movie details and add to query
    if (movie) {
      // Get movie details by name
      movie = await moiveServices.getMoviesByName(movie);
      // Add movie filter to query using $all operator
      query.movies = { $all: movie };
    }

    // Call service to fetch theatres matching query
    const data = await theatreService.FetchTheatre(query);

    // Return 200 OK with theatres data
    return res.status(statusCode.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    // Return error response with status code from error or default 500
    return res
      .status(error.statusCode || statusCode.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: error.message,
      });
  }
};

/**
 * DELETE THEATRE CONTROLLER
 * Handles theatre deletion request
 * @param {Object} req - Express request object with theatre ID in params
 * @param {Object} res - Express response object
 * @returns {JSON} Response with deleted theatre data
 */
const deleteTheatres = async (req, res) => {
  try {
    // Extract theatre ID from URL parameters
    const theatreID = req.params.id;

    // Validate that theatre ID is provided
    if (!theatreID) {
      // Create and throw error if ID is missing
      const error = new Error("Required parameters are missing");
      error.statusCode = 400;
      throw error;
    }

    // Call service to delete theatre from database
    const removedTheatre = await theatreService.DeleteTheatre(theatreID);

    // Return 200 OK with deleted theatre data
    return res.status(statusCode.OK).json({
      message: "Theatre Deleted  SucessFull",
      success: true,
      data: removedTheatre,
    });
  } catch (error) {
    // Return error response with appropriate status code
    return res.status(error.statusCode).json({
      message: error.message,
      success: false,
    });
  }
};

/**
 * UPDATE THEATRE CONTROLLER
 * Handles theatre details update request
 * @param {Object} req - Express request object with theatre ID in params and fields in query
 * @param {Object} res - Express response object
 * @returns {JSON} Response with updated theatre data
 */
const updateTheatre = async (req, res) => {
  try {
    // Extract theatre ID from URL parameters
    const theatreID = req.params.id;
    console.log("Theatre ID :", theatreID);

    // Initialize empty object to store update fields
    const data = {};
    // Extract updatable fields from query parameters
    const { name, city, pincode } = req.query;

    // Build update object based on provided fields
    if (name) {
      data.name = name;
    }
    if (city) {
      data.city = city;
    }
    if (pincode) {
      data.pincode = pincode;
    }

    // Validate that theatre ID is provided
    if (!theatreID) {
      // Create and throw error if ID is missing
      const err = new Error("All Fields are Required");
      err.statusCode = 400;
      err.success = false;
      throw err;
    }

    // Call service to update theatre with provided data
    const UpdatedTheatre = await theatreService.updateTheatre(theatreID, data);

    // Return 200 OK with updated theatre data
    return res.status(statusCode.OK).json({
      message: "Updattion Sucessfull",
      data: UpdatedTheatre,
    });
  } catch (error) {
    // Return 400 error with error details
    return res.status(error.statusCode || statusCode.BAD_REQUEST).json({
      message: error.message,
      success: error.success,
    });
  }
};

/**
 * THEATRE MOVIES CONTROLLER
 * Handles adding or removing movies from a theatre
 * @param {Object} req - Express request object with theatre ID in params and {movies, insert} in body
 * @param {Object} res - Express response object
 * @returns {JSON} Response with updated theatre data including movies
 */
const theatreMoviesController = async (req, res) => {
  try {
    // Extract theatre ID from URL parameters
    const theatreID = req.params.id;

    // Validate that theatre ID is provided
    if (!theatreID) {
      // Create and throw error if ID is missing
      const error = new Error("Theatre ID is Missing");
      error.statusCode = statusCode.BAD_REQUEST;
      error.sucess = false;
      throw error;
    }

    // Extract movies array and insert flag from request body
    const { movies, insert } = req.body;

    // Call service to add or remove movies from theatre
    // insert = true: add movies, insert = false: remove movies
    const UpdatedTheatre = await theatreService.TheatreMoviesService(
      theatreID,
      movies,
      insert,
    );

    // Return 200 OK with updated theatre data
    res.status(statusCode.OK).json(UpdatedTheatre);
  } catch (error) {
    // Return 500 error with error object
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      error,
    });
  }
};

/**
 * MOVIES IN THEATRE CONTROLLER
 * Handles fetching movies in a specific theatre (optionally filtered by movie ID)
 * @param {Object} req - Express request object with theatre ID in params and optional movie ID in query
 * @param {Object} res - Express response object
 * @returns {JSON} Response with theatre and its movies
 */
const moviesInTheatre = async (req, res) => {
  try {
    // Extract theatre ID from URL parameters
    const theatreID = req.params.id;
    // Extract optional movie ID from query parameters
    const movieID = req.query.movie || null;

    // Validate that theatre ID is provided
    if (!theatreID) {
      // Return 400 error if theatre ID is missing
      return res.status(statusCode.BAD_REQUEST).json({
        message: "Theatre ID is required",
      });
    }

    // Call service to fetch movies in theatre
    // If movieID provided, returns specific movie; otherwise returns all movies
    const theatre = await theatreService.getMoviesInTheatre(theatreID, movieID);

    // Return 200 OK with theatre and movies data
    return res.status(statusCode.OK).json({ theatre });
  } catch (err) {
    // Return error response with status code from error or default 500
    return res.status(err.statusCode || statusCode.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

// Export all theatre controller functions
export {
  createTheatre,
  getTheatres,
  deleteTheatres,
  theatreMoviesController,
  updateTheatre,
  moviesInTheatre,
};
