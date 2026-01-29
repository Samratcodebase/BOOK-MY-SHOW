// ===========================
// USER CONTROLLER MODULE
// ===========================
// This module handles user-related HTTP request handlers for signup and login operations

import userService from "../Services/user.services.js";
import jwt from "jsonwebtoken";
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

    res.cookie("jwt", token, {
      httpOnly: true, // JS can't access it (XSS protection)
      secure: true, // HTTPS only (MANDATORY in prod)
      sameSite: "strict", // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 1 day (ms)
    });
    // Return 200 OK status with user data and JWT token
    return res.status(200).json({
      Message: "User Retrival SuccessFull",
      Success: true,
      Data: user,
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

const logOut = async (req, res) => {
  try {
    req.cookie.jwt = " ";
    res.status(200).json({
      message: "Log Out Sucessfull",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const PasswordReset = async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const userId = decoded.id || decoded.userId;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    await userService.passRest(oldpassword, newpassword, userId);

    // Invalidate session
    res.clearCookie("jwt");

    return res.status(200).json({
      message: "Password reset successful. Please login again.",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

// Export user controller functions
export default { signUp, singIn, logOut, PasswordReset };
