// ===========================
// APPLICATION SERVER ENTRY POINT
// ===========================
// This is the main server file that initializes the application,
// connects to MongoDB database, and starts the Express server

// Load environment variables from .env file into process.env
import "dotenv/config";
// Import configured Express application with routes and middleware
import app from "./src/app.js";
// Import database connection function
import ConnectToDB from "./src/Utils/DB/index.js";

/**
 * SERVER INITIALIZATION SEQUENCE
 * 1. Connect to MongoDB database
 * 2. Start Express server on configured port
 * 3. Handle connection errors and gracefully exit if needed
 */
ConnectToDB()
  .then(() => {
    // Database connection successful, start Express server
    app.listen(process.env.PORT, () => {
      // Log server startup message with URL
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    // Database connection failed, log error and exit process
    console.error("Database Connection Failed:", err.message);
    // Exit process with error code 1
    process.exit(1); 
  });
