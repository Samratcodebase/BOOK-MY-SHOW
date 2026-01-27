// ===========================
// HEALTH CHECK ROUTES MODULE
// ===========================
// This module defines the health check endpoint to verify API and authentication status

import express from "express";
import AuthMiddleware from "../Middleware/auth.middleware.js";
import { HealthCheck } from "../Controllers/healthCheck.controller.js";

// Initialize Express router
const router = express.Router();

/**
 * GET /check - Health check endpoint
 * Requires: Valid JWT token in Authorization header
 * Middleware: AuthMiddleware.isAuthenticated (validates user authentication)
 * Response: Health status of the API
 */
router.get("/check", AuthMiddleware.isAuthenticated, HealthCheck);

// Export router with health check route
export default router;
