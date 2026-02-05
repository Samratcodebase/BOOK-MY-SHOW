// ===========================
// USER ROUTES MODULE
// ===========================
// This module defines all user-related API endpoints including signup and login

import userController from "../Controllers/user.controller.js";
import express from "express";
import authMiddleware from "../Middleware/auth.middleware.js";

// Initialize Express router
const router = express.Router();

/**
 * POST /signup
 * User registration endpoint
 *
 * calls userController.signUp to create new user account
 */
router.post(
  "/signup",

  userController.signUp,
);

/**
 * GET /login
 * User login endpoint
 * Authenticates user credentials and returns JWT token
 * Controller: userController.singIn
 */
router.get("/login", userController.singIn);
/**
 * GET /logout
 * User Logout Point
 * Remove the JWT from Client Side
 * Controller: userController.logout
 */
// GET /profile
// Protected route: only accessible if the user is authenticated
// authMiddleware.isAuthenticated verifies token/session before controller runs
router.get("/profile", authMiddleware.isAuthenticated, userController.profile);

// GET /logout
// Logs the user out by clearing session / token / cookie
// ⚠️ This route is NOT protected — anyone can hit it
// That’s usually fine if logout just clears client-side auth,
// but risky if it performs server-side state changes
router.get("/logout", userController.logOut);

// POST /resetpassword
// Handles password reset logic
// Typically expects data like email / token / newPassword in request body
// ⚠️ No authentication or rate-limiting shown here —
// without safeguards, this endpoint is abuse-prone
router.post("/resetpassword", userController.PasswordReset);

// Export router with all user routes
export default router;
