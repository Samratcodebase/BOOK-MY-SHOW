// ===========================
// USER ROUTES MODULE
// ===========================
// This module defines all user-related API endpoints including signup and login

import userController from "../Controllers/user.controller.js";
import express from "express";

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

router.get("/logout", userController.logOut);
router.post("/resetpassword", userController.PasswordReset);
// Export router with all user routes
export default router;
