import userController from "../Controllers/user.controller.js";
import ValidateSignUpRequest from "../Middleware/auth.middleware.js";
import express from "express";

const router = express.Router();
router.post("/signup", ValidateSignUpRequest, userController.signUp);
router.get("/login", userController.singIn);

export default router;
