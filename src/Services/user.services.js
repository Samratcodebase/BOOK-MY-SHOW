// ===========================
// USER SERVICE MODULE
// ===========================
// This module handles user-related business logic including user creation and authentication

import User from "../Models/user.model.js";
import jwt from "jsonwebtoken";
import { statusCode } from "../Utils/constant.js";

/**
 * CREATE USER SERVICE
 * Creates a new user account with the provided credentials
 * @param {string} username - The username for the new user
 * @param {string} email - The email address of the user
 * @param {string} password - The password for the user account
 * @returns {Promise<Object>} The created user object
 * @throws {Error} If user already exists (409) or creation fails (500)
 */
const createUser = async (username, email, password) => {
  // Check if user with this email already exists
  const isExists = await User.findOne({ email });
  if (isExists) {
    // Throw 409 Conflict error if user already exists
    const error = new Error("User Already Exists");
    error.statusCode = statusCode.CONFLICT;
    error.success = false;
    throw error;
  }

  // Create new user document in database
  const user = await User.create({ username, email, password });

  // Throw 500 error if user creation fails
  if (!user) {
    const error = new Error("Internal Service Error");
    error.statusCode = statusCode.INTERNAL_SERVER_ERROR;
    error.success = false;
    throw error;
  }

  // Return the newly created user
  return user;
};

/**
 * LOGIN USER SERVICE
 * Authenticates a user and generates a JWT token
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @returns {Promise<Object>} Object containing user info and JWT token
 * @throws {Error} If user not found (409) or password doesn't match (409)
 */
const loginUser = async (email, password) => {
  // Find user by email address
  const user = await User.findOne({ email });

  // Return error if user not found
  if (!user) {
    // Throw 401 error if user not found
    const error = new Error("Invalid Credentials");
    error.statusCode = statusCode.UNAUTHORISED;
    error.success = false;
    throw error;
  }

  // Verify password against stored hash using model method
  const isMatched = await user.comparePassword(password);

  // Return error if password doesn't match
  if (!isMatched) {
    const error = new Error("Invalid Credentials");
    error.statusCode = statusCode.UNAUTHORISED;
    error.success = false;
    throw error;
  }

  // Generate JWT token with 1 hour expiration
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  // Verify token and log decoded payload for debugging
  console.log(jwt.verify(token, process.env.JWT_SECRET));

  // Return user data and token
  return {
    // User information object
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    // JWT authentication token
    token,
  };
};

const passwordReset = async (oldpassword, newpassword, id) => {
  const user = await User.findById(id);
  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = statusCode.UNAUTHORISED;
    throw err;
  }

  const isMatched = await user.comparePassword(oldpassword);
  if (!isMatched) {
    const err = new Error("Invalid credentials");
    err.statusCode = statusCode.UNAUTHORISED;
    throw err;
  }

  user.password = newpassword; // hashed via pre-save hook
  await user.save();

  return { success: true };
};

const addBookingToUser = async (userID, bookingID) => {
  try {
    console.log("InsIDE uSE sERVICE");

    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { $addToSet: { bookings: bookingID } }, // no duplicates
      { new: true },
    );

    if (!updatedUser) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    return updatedUser;
  } catch (error) {
    console.error("Failed to add booking to user:", error);
    throw error; // never swallow
  }
};
const getprofile = async (id) => {
  const user = await User.findById(id).populate({
    path: "bookings",
    populate: [
      { path: "theatreID", select: "name city" },
      { path: "movieID", select: "movieName language" },
    ],
  });

  if (!user) {
    const error = new Error("user Not Found");
    error.statusCode = statusCode.NOT_FOUND;
    error.success = false;
    throw error;
  }

  return user;
};

// Export user service functions
export default {
  createUser,
  loginUser,
  passwordReset,
  addBookingToUser,
  getprofile,
};
