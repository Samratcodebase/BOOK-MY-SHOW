import {
  createTheatre,
  getTheatres,
  deleteTheatres,
  theatreMoviesController,
  updateTheatre,
  moviesInTheatre,
} from "../Controllers/theatre.controller.js";
import express from "express";
const router = express.Router();

router.route("/theatres").get(getTheatres).post(createTheatre);
router.route("/theatres/:id").patch(updateTheatre).delete(deleteTheatres);
router.route("/theatres/:id/movies").get(moviesInTheatre);
router.patch("/theatres/:id/add/movies", theatreMoviesController);


export default router;
