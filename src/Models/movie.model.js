// ===========================
// MOVIE MODEL MODULE
// ===========================
// This module defines the Movie schema and model for managing movie information

import mongoose from "mongoose";

/**
 * MOVIE SCHEMA
 * Defines the structure and validation rules for movie documents
 * Includes movie details like cast, trailer, release information, etc.
 */
const movieSchema = new mongoose.Schema(
  {
    // Movie title (required, unique identifier)
    movieName: {
      type: String,
      required: true,
    },

    // Movie synopsis/plot description (required)
    description: {
      type: String,
      required: true,
    },

    // Array of actor/actress names (required, at least one cast member)
    casts: {
      type: [String],
      required: true,
    },

    // URL link to movie trailer (required)
    trailerUrl: {
      type: String,
      required: true,
    },

    // Movie language (required, defaults to English)
    language: {
      type: String,
      required: true,
      default: "English",
    },

    // Movie release date (required, stored as string)
    releaseDate: {
      type: String,
      required: true,
    },

    // Director's name (required)
    director: {
      type: String,
      required: true,
    },

    // Release status of movie (required, defaults to RELEASED)
    // Can be: RELEASED, UPCOMING, CANCELLED, etc.
    releaseStatus: {
      type: String,
      required: true,
      default: "RELEASED",
    },
  },
  { timestamps: true }, // Auto-adds createdAt and updatedAt fields
);

// Create Movie model from schema
const movie = mongoose.model("Movies", movieSchema);

// Export Movie model
export default movie;
