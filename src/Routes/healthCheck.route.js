import express from "express";
import AuthMiddleware from "../Middleware/auth.middleware.js";
import { HealthCheck } from "../Controllers/healthCheck.controller.js";
const router = express.Router();

router.get("/check", AuthMiddleware.isAuthenticated, HealthCheck);

export default router;
