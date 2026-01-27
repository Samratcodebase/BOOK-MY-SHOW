// ===========================
// USER CONTROLLER MODULE
// ===========================
// This module handles user-related HTTP request handlers for signup and login operations

import userService from "../Services/user.services.js";

/**
 * SIGN UP CONTROLLER
 * Handles user registration request
 * @param {Object} req - Express request object containing {username, email, password} in body
 * @param {Object} res - Express response object
 * @returns {JSON} Response with user data and registration status
 */
const signUp = async (req, res) => {
  try {
    // Extract user credentials from request body
    const { username, email, password } = req.body;

    // Call service to create new user in database
    const User = await userService.createUser(username, email, password);

    // Return 201 Created status with new user data
    return res.status(201).json({
      Message: "User Registration SuccessFull",
      Success: true,
      Data: User,
    });
  } catch (error) {
    // Extract status code from error object, default to 500 if not present
    const statusCode = Number(error && error.statusCode) || 500;
    // Extract success flag from error object, default to false if not boolean
    const success =
      typeof (error && error.success) === "boolean" ? error.success : false;
    // Return error response with appropriate status code and message
    return res.status(statusCode).json({
      Message: error && error.message ? error.message : "Internal Server Error",
      Success: success,
    });
  }
};

/**
 * SIGN IN CONTROLLER
 * Handles user login request and generates JWT token
 * @param {Object} req - Express request object containing {email, password} in body
 * @param {Object} res - Express response object
 * @returns {JSON} Response with user data and JWT token
 */
const singIn = async (req, res) => {
  try {
    // Extract login credentials from request body
    const { email, password } = req.body;

    // Validate that both email and password are provided
    if (!email || !password) {
      // Throw error if required fields are missing
      const error = new Error("All Fileds Required");
      error.statusCode = 401;
      error.success = false;
      throw error;
    }

    // Call service to authenticate user and get token
    const { user, token } = await userService.loginUser(email, password);

    // Return 200 OK status with user data and JWT token
    return res.status(200).json({
      Message: "User Retrival SuccessFull",
      Success: true,
      Data: user,
      token,
    });
  } catch (error) {
    // Extract status code from error object, default to 500 if not present
    const statusCode = Number(error && error.statusCode) || 500;
    // Extract success flag from error object, default to false if not boolean
    const success =
      typeof (error && error.success) === "boolean" ? error.success : false;
    // Return error response with appropriate status code and message
    return res.status(statusCode).json({
      Message: error && error.message ? error.message : "Internal Server Error",
      Success: success,
    });
  }
};

// Export user controller functions
export default { signUp, singIn };
