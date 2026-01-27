// ===========================
// DATABASE CONNECTION MODULE
// ===========================
// This module handles MongoDB connection initialization and configuration

// Load environment variables from .env file
import "dotenv/config";
import mongoose from "mongoose";

/**
 * CONNECT TO DB FUNCTION
 * Establishes connection to MongoDB database using Mongoose
 * Uses connection string from MONGO_URI environment variable
 * @param {Object} req - Express request object (unused but kept for middleware compatibility)
 * @param {Object} res - Express response object (unused but kept for middleware compatibility)
 * @returns {Promise<void>} Promise that resolves when connection attempt completes
 */
const ConnectToDB = async (req, res) => {
  // Attempt to connect to MongoDB using connection URI from environment variables
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      // Log success message if connection is established
      console.log("MongoDB  Server is Connected");
    })
    .catch((err) => {
      // Log error message if connection fails
      console.log("Error Connecting the DB", err);
    });
};

// Export database connection function
export default ConnectToDB;
