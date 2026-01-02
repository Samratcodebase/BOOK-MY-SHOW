import { createTheatre } from "../Controllers/theatre.controller.js";
import express from "express";
const router = express.Router();


router.post("/theatre", createTheatre);

export default router;
