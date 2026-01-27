// ===========================
// HEALTH CHECK CONTROLLER MODULE
// ===========================
// This module provides a simple health check endpoint to verify API server status and connectivity

/**
 * HEALTH CHECK CONTROLLER
 * Verifies that the API server is running and accessible
 * Returns a 200 OK status with a success message
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} Response with server health status message
 */
const HealthCheck = async (req, res) => {
  // Return 200 OK status with health check message
  res.status(200).json({
    message: "Server Health Is Ok : 200",
  });
};

// Export health check controller function
export { HealthCheck };
