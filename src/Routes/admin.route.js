// Import Express to create an isolated router for admin routes
import express from "express";

// Controller containing admin-only business logic
import adminController from "../Controllers/admin.controller.js";

// Authentication & authorization middleware
import AuthMiddleware from "../Middleware/auth.middleware.js";

// Initialize admin router
const router = express.Router();

// PATCH /update/:id/user
// Updates user details by user ID
// Access control:
// 1. isAuthenticated → ensures requester is logged in
// 2. isAdmin → ensures requester has admin privileges
router.patch(
  "/update/:id/user",
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isAdmin,
  adminController.updateUser,
);

// POST /shows
// Creates new shows (admin-only operation)
// ⚠️ Currently UNPROTECTED — any user can create shows
// This is a security hole unless handled elsewhere
router.post("/shows", adminController.createShows);

// Export admin router for app-level mounting
export default router;
