// ===========================
// THEATRE SERVICE MODULE
// ===========================
// This module handles all theatre-related business logic including CRUD operations and movie management

import Theatre from "../Models/theatre.model.js";
import mongoose from "mongoose";

/**
 * CREATE THEATRE SERVICE
 * Creates a new theatre with the provided details
 * @param {Object} payload - Theatre data {name, description, city, pincode, address}
 * @returns {Promise<Object>} The created theatre document
 * @throws {Error} If theatre already exists or creation fails
 */
const createTheatre = async (payload) => {
  // Extract theatre details from payload
  const { name, description, city, pincode, address } = payload;

  // Check if theatre with same name already exists
  let theatre = await Theatre.findOne({ name: name });

  if (theatre) {
    // Throw error if theatre is already registered
    throw new Error("Allready Registered");
  }

  // Create new theatre document in database
  theatre = await Theatre.create({ name, description, city, pincode, address });
  if (!theatre) {
    // Throw error if creation fails
    throw new Error("Internal ServerError", 500);
  }
  // Return the newly created theatre
  return theatre;
};

/**
 * DELETE THEATRE SERVICE
 * Deletes a theatre by its ID
 * @param {string} theatreID - The MongoDB ObjectId of the theatre to delete
 * @returns {Promise<Object>} The deleted theatre document
 * @throws {Error} If theatre ID is invalid or theatre not found
 */
const DeleteTheatre = async (theatreID) => {
  // Validate if theatre ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(theatreID)) {
    throw new Error("Invalid Theatre ID");
  }

  // Find and delete theatre by ID
  const deletedTheatre = await Theatre.findByIdAndDelete(theatreID);

  if (!deletedTheatre) {
    // Throw error if theatre not found or deletion fails
    const error = new Error("Internal Service Error");
    error.statusCode = 500;
    throw error;
  }

  // Return the deleted theatre document
  return deletedTheatre;
};

/**
 * FETCH THEATRE SERVICE
 * Fetches theatres based on query parameters and populates their movies
 * @param {Object} query - MongoDB query object to filter theatres
 * @returns {Promise<Array>} Array of theatre documents with populated movies
 * @throws {Error} If no theatres match the query
 */
const FetchTheatre = async (query) => {
  // Query theatres and populate their associated movies
  const theatres = await Theatre.find(query).populate("movies");

  // Check if theatres array is empty (no results found)
  if (!theatres.length) {
    // Throw 404 error if no theatres match the query
    const error = new Error("Theatre not found");
    error.statusCode = 404;
    throw error;
  }

  // Return array of theatres with populated movies
  return theatres;
};

/**
 * THEATRE MOVIES SERVICE
 * Updates movies in a theatre (add or remove)
 * @param {string} theatreID - The MongoDB ObjectId of the theatre
 * @param {Array<string>} movies - Array of movie IDs to add or remove
 * @param {boolean} insert - If true, adds movies; if false, removes them
 * @returns {Promise<Object>} Updated theatre document with populated movies
 * @throws {Error} If theatre not found or update fails
 */
const TheatreMoviesService = async (theatreID, movies, insert) => {
  // Find theatre by ID
  let theatre = await Theatre.findOne({ _id: theatreID });

  if (!theatre) {
    // Throw error if theatre not found
    throw new Error("Internal Server Error");
  }

  // Check if operation is remove or add
  if (!insert) {
    // REMOVE mode: Use $pull to remove movies from theatre
    theatre = await Theatre.findByIdAndUpdate(
      theatreID,
      {
        $pull: {
          movies: { $in: movies },
        },
      },
      { new: true },
    );
  } else {
    // ADD mode: Use $addToSet to add unique movies to theatre
    theatre = await Theatre.findByIdAndUpdate(
      theatreID,
      {
        $addToSet: {
          movies: { $each: movies },
        },
      },
      { new: true },
    );
  }

  if (!theatre) {
    // Throw error if update fails
    throw new Error("Internal Server Error");
  }
  // Populate movies and return updated theatre
  theatre = await theatre.populate("movies");
  return theatre;
};

/**
 * UPDATE THEATRE SERVICE
 * Updates theatre details (name, description, etc.)
 * @param {string} theatreID - The MongoDB ObjectId of the theatre
 * @param {Object} data - Fields to update
 * @returns {Promise<Object>} Updated theatre document with populated movies
 * @throws {Error} If theatre not found or update fails
 */
const updateTheatre = async (theatreID, data) => {
  // Find theatre and update with provided data
  const theatre = await Theatre.findOneAndUpdate({ _id: theatreID }, data, {
    new: true,
  });

  if (!theatre) {
    // Throw error if theatre not found or update fails
    throw new Error("Internal Server Error");
  }

  // Populate movies and return updated theatre
  return await theatre.populate("movies");
};

/**
 * GET MOVIES IN THEATRE SERVICE
 * Fetches movies in a theatre (optionally filtered by specific movie ID)
 * @param {string} theatreID - The MongoDB ObjectId of the theatre
 * @param {string|null} movieID - Optional specific movie ID to fetch
 * @returns {Promise<Object>} Theatre with movies (all or specific one)
 * @throws {Error} If theatre or movie not found
 */
const getMoviesInTheatre = async (theatreID, movieID) => {
  // Convert theatre ID to ObjectId
  const theatreObjectId = new mongoose.Types.ObjectId(theatreID);

  // Validate and normalize movie ID if provided
  const movieObjectId =
    movieID && mongoose.Types.ObjectId.isValid(movieID)
      ? new mongoose.Types.ObjectId(movieID)
      : null;

  /**
   * CASE 1: NO movieID provided
   * → Fetch theatre with all its movies
   * → Populate entire movies array
   */
  if (!movieObjectId) {
    // Fetch theatre and populate all its movies
    const theatre = await Theatre.findById(theatreObjectId).populate("movies");

    if (!theatre) {
      // Throw error if theatre not found
      const err = new Error("Theatre not found");
      err.statusCode = 404;
      throw err;
    }

    // Return theatre with all movies
    return theatre;
  }

  /**
   * CASE 2: Both theatreID and movieID provided
   * → Use aggregation pipeline to filter specific movie
   * → Return only the matched movie from theatre
   */
  const pipeline = [
    // STEP 1: Match the theatre
    { $match: { _id: theatreObjectId } },

    // STEP 2: Filter to only include the requested movie
    {
      $project: {
        name: 1,
        location: 1,
        movies: {
          $filter: {
            input: "$movies",
            as: "m",
            cond: { $eq: ["$$m", movieObjectId] },
          },
        },
      },
    },

    // STEP 3: Drop theatre if movie not found (empty movies array)
    { $match: { movies: { $ne: [] } } },

    // STEP 4: Lookup to populate movie details from movies collection
    // (aggregation doesn't support .populate(), so we use $lookup)
    {
      $lookup: {
        from: "movies",
        localField: "movies",
        foreignField: "_id",
        as: "movies",
      },
    },
  ];

  // Execute aggregation pipeline
  const result = await Theatre.aggregate(pipeline);

  if (result.length === 0) {
    // Throw error if theatre or movie not found
    const err = new Error("Theatre or Movie not found");
    err.statusCode = 404;
    throw err;
  }

  // Return the theatre with the specific movie
  return result[0];
};

// Export all theatre service functions
export default {
  createTheatre,
  DeleteTheatre,
  FetchTheatre,
  TheatreMoviesService,
  updateTheatre,
  getMoviesInTheatre,
};
