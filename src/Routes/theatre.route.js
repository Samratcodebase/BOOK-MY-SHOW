import {
  createTheatre,
  getTheatres,
  deleteTheatres,
  theatreMoviesController,
} from "../Controllers/theatre.controller.js";
import express from "express";
const router = express.Router();

router.post("/theatres", createTheatre);
router.get("/theatres", getTheatres);
router.get("/theatres/:name", getTheatres);
router.delete("/theatres/:id", deleteTheatres);
router.patch("/theatres/:id/movies", theatreMoviesController);
export default router;
