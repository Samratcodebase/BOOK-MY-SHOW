// ===========================
// USER ROUTES MODULE
// ===========================
// This module defines all user-related API endpoints including signup and login

import userController from "../Controllers/user.controller.js";
import AuthMiddleware from "../Middleware/auth.middleware.js";
import express from "express";

// Initialize Express router
const router = express.Router();

/**
 * POST /signup
 * User registration endpoint
 * Validates signup request using AuthMiddleware.ValidateSignUpRequest
 * Then calls userController.signUp to create new user account
 */
router.post(
  "/signup",
  AuthMiddleware.ValidateSignUpRequest,
  userController.signUp,
);

/**
 * GET /login
 * User login endpoint
 * Authenticates user credentials and returns JWT token
 * Controller: userController.singIn
 */
router.get("/login", userController.singIn);

// Export router with all user routes
export default router;
