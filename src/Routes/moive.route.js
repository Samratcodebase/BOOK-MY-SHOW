import express from "express";
import { CreateMovies } from "../Controllers/moive.controller.js";
const router = express.Router();

router.post("/movies", CreateMovies);

export default router;
