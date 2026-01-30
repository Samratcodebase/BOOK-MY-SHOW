// ===========================
// AUTHENTICATION MIDDLEWARE MODULE
// ===========================
// This module provides middleware functions for user authentication and signup request validation

import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";
import { ROLES } from "../Utils/constant.js";

/**
 * VALIDATE SIGNUP REQUEST MIDDLEWARE
 * Validates signup request body and enforces required fields and formats
 * @param {Object} req - Express request object containing user data in req.body
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const ValidateSignUpRequest = (req, res, next) => {
  // Extract user credentials from request body
  const { username, email, password } = req.body;

  // Check if all required fields are present
  if (!username || !email || !password) {
    // Return 400 error if any required field is missing
    return res.status(400).json({
      success: false,
      message: "username, email, and password are required",
    });
  }

  // Validate data types - all fields must be strings
  if (
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    // Return 400 error if any field has invalid data type
    return res.status(400).json({
      success: false,
      message: "Invalid data types",
    });
  }

  // Validate email format using regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    // Return 400 error if email format is invalid
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  // Validate password minimum length requirement
  if (password.length < 10) {
    // Return 400 error if password is less than 10 characters
    return res.status(400).json({
      success: false,
      message: "Password must be at least 10 characters long",
    });
  }

  // All validations passed, proceed to next middleware
  next();
};

/**
 * IS AUTHENTICATED MIDDLEWARE
 * Verifies JWT token from request headers and validates user authentication
 * @param {Object} req - Express request object containing JWT in x-access-token header
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isAuthenticated = (req, res, next) => {
  try {
    // Extract JWT token from custom x-access-token header
    const token = req.headers["x-access-token"];

    // Verify token signature and decode payload using JWT_SECRET
    const response = jwt.verify(token, process.env.JWT_SECRET);
    console.log(response);

    // Attach decoded user data to request object for use in controllers
    req.user = response;
    // Token is valid, proceed to next middleware
    next();
  } catch (error) {
    // Catch JWT validation errors and return error details
    return res.status(400).json({
      Error: error.name,
      message: error.message,
      stack: error.stack,
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const ID = req.user.id;
    const isAdmin = await User.findOne({ _id: ID, role: ROLES.ADMIN });
    if (!isAdmin) {
      return res.status(403).json({
        message: "Only Admins are Allowed",
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({
      Error: error.name,
      message: error.message,
    });
  }
};

// Export authentication middleware functions
export default { ValidateSignUpRequest, isAuthenticated, isAdmin };
