// ===========================
// THEATRE MODEL MODULE
// ===========================
// This module defines the Theatre schema and model for managing movie theatres and their associated movies

import mongoose from "mongoose";

/**
 * THEATRE SCHEMA
 * Defines the structure and validation rules for theatre documents
 * Includes theatre details and references to movies showing in the theatre
 */
const theatreSchema = new mongoose.Schema(
  {
    // Theatre name (required, unique identifier)
    name: {
      type: String,
      required: true,
    },

    // Theatre description (optional)
    description: String,

    // City where theatre is located (required)
    city: {
      type: String,
      required: true,
    },

    // Pincode/postal code of theatre location (required)
    pincode: {
      type: Number,
      required: true,
    },

    // Full address of theatre (optional)
    address: String,

    // Array of movie references - stores ObjectIds of movies showing in this theatre
    // Uses populate() to fetch full movie documents
    movies: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Movies",
    },
  },
  { timestamps: true }, // Auto-adds createdAt and updatedAt fields
);

// Create Theatre model from schema
const Theatre = mongoose.model("Theatre", theatreSchema);

// Export Theatre model
export default Theatre;
