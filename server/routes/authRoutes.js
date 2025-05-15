const express = require("express");
const { validateRegister } = require("../validators/registrationValidator");
const {
  registerUser,
  verifyEmail,
  loginUser,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

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

module.exports = router;
