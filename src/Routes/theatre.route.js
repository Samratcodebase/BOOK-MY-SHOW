import {
  createTheatre,
  getTheatres,
  deleteTheatres,
} from "../Controllers/theatre.controller.js";
import express from "express";
const router = express.Router();

router.post("/theatre", createTheatre);
router.get("/theatres", getTheatres);
router.get("/theatres/:name", getTheatres);
router.delete("/theatres/:id", deleteTheatres);
export default router;
