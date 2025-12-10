import express from "express";
import { HealthCheck } from "../Controllers/healthCheck.controller.js";
const router = express.Router();

router.get("/check", HealthCheck);

export default router;
