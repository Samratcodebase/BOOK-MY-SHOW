import express from "express";
import {
  CreateMovies,
  getMovies,
  deleteMovie,
} from "../Controllers/moive.controller.js";
const router = express.Router();

router.post("/movies", CreateMovies);
router.get("/movies", getMovies);
router.delete("/movies/:id", deleteMovie);
router.patch("/update", )

export default router;
