import express from "express";
import {
  CreateMovies,
  MoviesByName,
  deleteMovie,
  updateMovie,
} from "../Controllers/moive.controller.js";
const router = express.Router();

router.post("/movies", CreateMovies);
router.get("/movies", MoviesByName);
router.delete("/movies/:id", deleteMovie);
router.patch("/update", updateMovie);

export default router;
