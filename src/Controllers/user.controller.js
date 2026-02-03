// ===========================
// USER CONTROLLER MODULE
// ===========================
// This module handles user-related HTTP request handlers for signup and login operations

import userService from "../Services/user.services.js";
import { statusCode } from "../Utils/constant.js";
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
    return res.status(statusCode.CREATED).json({
      Message: "User Registration SuccessFull",
      Success: true,
      Data: User,
    });
  } catch (error) {
    // Extract status code from error object, default to 500 if not present
    const code =
      Number(error && error.statusCode) || statusCode.INTERNAL_SERVER_ERROR;
    // Extract success flag from error object, default to false if not boolean
    const success =
      typeof (error && error.success) === "boolean" ? error.success : false;
    // Return error response with appropriate status code and message
    return res.status(code).json({
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
      error.statusCode = statusCode.UNAUTHORISED;
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
    return res.status(statusCode.OK).json({
      Message: "User Retrival SuccessFull",
      Success: true,
      Data: user,
    });
  } catch (error) {
    // Extract status code from error object, default to 500 if not present
    const statusCode =
      Number(error && error.statusCode) || statusCode.INTERNAL_SERVER_ERROR;
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
    res.status(statusCode.OK).json({
      message: "Log Out Sucessfull",
    });
  } catch (error) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
};

const PasswordReset = async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(statusCode.UNAUTHORISED)
        .json({ message: "Authentication required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res
        .status(statusCode.UNAUTHORISED)
        .json({ message: "Invalid or expired token" });
    }

    const userId = decoded.id || decoded.userId;
    if (!userId) {
      return res
        .status(statusCode.UNAUTHORISED)
        .json({ message: "Invalid token payload" });
    }

    await userService.passRest(oldpassword, newpassword, userId);

    // Invalidate session
    res.clearCookie("jwt");

    return res.status(statusCode.OK).json({
      message: "Password reset successful. Please login again.",
    });
  } catch (error) {
    return res
      .status(error.statusCode || statusCode.INTERNAL_SERVER_ERROR)
      .json({
        message: error.message || "Internal Server Error",
        success: false,
      });
  }
};

const profile = async (req, res) => {
  try {
    const response = await userService.getprofile(req.user.id);

    return res.status(statusCode.OK).json({
      message: "User Fetch SuccessFull",
      data: response,
    });
  } catch (error) {
    const statuscode =
      Number(error && error.statusCode) || statusCode.INTERNAL_SERVER_ERROR;
    // Extract success flag from error object, default to false if not boolean
    const success =
      typeof (error && error.success) === "boolean" ? error.success : false;
    // Return error response with appropriate status code and message
    return res.status(statuscode).json({
      Message: error && error.message ? error.message : "Internal Server Error",
      Success: success,
    });
  }
};
// Export user controller functions
export default { signUp, singIn, logOut, PasswordReset, profile };
