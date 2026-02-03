import express from "express";
import adminController from "../Controllers/admin.controller.js";
import AuthMiddleware from "../Middleware/auth.middleware.js";

const router = express.Router();

router.patch(
  "/update/:id/user",
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isAdmin,
  adminController.updateUser,
);


router.post("/shows",adminController.createShows);
export default router;
