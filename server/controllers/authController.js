const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");


// Validation Middleware for registerUser route
const validateRegister = [
  body("firstName").notEmpty().withMessage("You did not enter your first name!").isAlpha().withMessage("Your first name should contain only letters!").isLength({ min: 2 }).withMessage("Your first name should be at least 2 characters long!"),
  body("lastName").notEmpty().withMessage("Please enter your last name!").isAlpha().withMessage("Your last name should contain only letters!").isLength({ min: 2 }).withMessage("Your last name should be at least 2 characters long!"),
  body("phoneNumber").notEmpty().withMessage("Please enter your phone number!").isNumeric().withMessage("Phone number should contain only numbers").isLength({ min: 10, max: 10 }).withMessage("Your phone number must be exactly 10 digits"),
  body("email").isEmail().withMessage("Please enter a valid email address!"),
  body("username").notEmpty().withMessage("Please enter your preferred username!").isLowercase().withMessage("Username should be in lowercase").isLength({ min: 3 }).withMessage("Username should be at least 3 characters long").matches(/^[a-z]+$/).withMessage("Username should contain only lowercase letters, no special characters!"),
  body("password").notEmpty().withMessage("Please enter your preferred password!").isLength({ min: 8 }).withMessage("Password should be at least 8 characters long!").matches(/[A-Z]/).withMessage("Password should contain at least one uppercase letter!").matches(/[a-z]/).withMessage("Password should contain at least one lowercase letter!").matches(/[0-9]/).withMessage("Password should contain at least one number!").matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password should contain at least one special character!"),
  body("role").isIn(["student", "teacher", "parent"]).withMessage("You must select your user category: student, teacher, or parent!"),
];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, phoneNumber, email, username, password, role, frontendUrl } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    return res.json({ message: "This user already exists. Try another email address" });
  }

  // Create a new user
  const user = await User.create({
    firstName,
    lastName,
    phoneNumber,
    email,
    username,
    password,
    role,
  });

  if (user) {
      // Generate email verification token (valid for 1 hour)
      const emailToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h", // Set token to expire in 1 hour
      });

      // Create email verification URL
      const verifyUrl = `${frontendUrl}/verify-email/${emailToken}`;

      // Prepare email message
      const message = `
          <p>Hello ${user.firstName},</p>
          <h1>Welcome to Ra'Asis SPA. Just One More Step... Verify Your Email</h1>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verifyUrl}">Verify Email</a>
      `;

      // Send verification email
      await sendMail({
          email: user.email,
          subject: "Ra\"Asis Student Progress Analytics - Email Verification",
          message,
      });

      res.status(201).json({
          message: "Registration successful! Please check your email to verify your account.",
      });
  } else {
      res.status(400).json({ message: "Invalid user data" });
  }
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
          return res.status(400).json({ message: "Invalid token or user not found" });
      }

      // Update user as verified
      user.isVerified = true;
      await user.save();

      res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
      res.status(400).json({ message: "Invalid or expired token" });
  }
});


// @desc    Login a registered and verified user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid email/username or password" });
  }

  // Check if the account is locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    return res.status(403).json({ message: "Your account is locked! Try again later." });
  }

  // Check if the password matches
  const isMatch = await user.matchPassword(password);

  if (isMatch) {
    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in." });
    }

    // Reset login attempts and lock status on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    // Increment login attempts if password is incorrect
    user.loginAttempts += 1;

    // Lock account if login attempts reach or exceed 5
    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 24 * 60 * 60 * 1000; // Lock for 24 hrs, Tutaadjust with change in sec policy

      // Send an email notifying the user of the account lock
      await sendMail({
        email: user.email,
        subject: "Your SPA Account Is Locked!",
        message: `<p>Attention ${user.firstName},</p>
        <p>Your Ra'Asis SPA Account has been locked due to multiple failed attempts to login. For security reasons, you won't be able to access your account for the next 24 hours. If this was not you, contact us immediately. Thank you for your patience.</p>`,
      });
    }

    await user.save();
    res.status(401).json({ message: "Invalid email/username or password" });
  }
});



// @desc    Request a password reset link
// @route   POST /api/auth/reset-password
// @access  Public
const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "No user found with this email address" });
  }

  // Generate a reset token valid for 15 minutes
  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  // Reset link with the token
  const resetUrl = `${req.body.frontendUrl}/reset-password/${resetToken}`;
  const message = `
    <p>Hello ${user.firstName},</p>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link is valid for 15 minutes. If you did not request this change, ignore this email.</p>
  `;

  // Send the email
  await sendMail({
    email: user.email,
    subject: "Ra\'Asis SPA - Password Reset",
    message,
  });

  res.status(200).json({ message: "Password reset link sent! Check your email." });
});

// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update user's password and save
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});


module.exports = { registerUser, validateRegister, verifyEmail, loginUser, requestPasswordReset, resetPassword };