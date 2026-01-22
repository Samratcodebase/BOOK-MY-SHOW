import userController from "../Controllers/user.controller.js";
import express from "express";

const router = express.Router();
router.post("/signup", userController.signUp);

export default router;
