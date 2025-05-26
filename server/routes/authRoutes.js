import { Router } from "express";
import { validateRegister } from "../validators/registrationValidator.js";
import {
  registerUser,
  verifyEmail,
  loginUser,
  requestPasswordReset,
  resetPassword,
} from "../controllers/authController.js";

const router = Router();

// Route for user registration
router.post("/register", validateRegister, registerUser);

//Route for email verification
router.get("/verify-email/:token", verifyEmail);

// Route for user login
router.post("/login", loginUser);

// Route for requesting a password reset
router.post("/reset-password", requestPasswordReset);

// Route for resetting password
router.post("/reset-password/:token", resetPassword);

export default router;
