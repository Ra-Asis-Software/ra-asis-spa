const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');


// Validation Middleware for registerUser route
const validateRegister = [
  body('firstName').notEmpty().withMessage('You did not enter your first name!').isAlpha().withMessage('Your first name should contain only letters!').isLength({ min: 2 }).withMessage('Your first name should be at least 2 characters long!'),
  body('lastName').notEmpty().withMessage('Please enter your last name!').isAlpha().withMessage('Your last name should contain only letters!').isLength({ min: 2 }).withMessage('Your last name should be at least 2 characters long!'),
  body('phoneNumber').notEmpty().withMessage('Please enter your phone number!').isNumeric().withMessage('Phone number should contain only numbers').isLength({ min: 10, max: 10 }).withMessage('Your phone number must be exactly 10 digits'),
  body('email').isEmail().withMessage('Please enter a valid email address!'),
  body('username').notEmpty().withMessage('Please enter your preferred username!').isLowercase().withMessage('Username should be in lowercase').isLength({ min: 3 }).withMessage('Username should be at least 3 characters long').matches(/^[a-z]+$/).withMessage('Username should contain only lowercase letters, no special characters!'),
  body('password').notEmpty().withMessage('Please enter your preferred password!').isLength({ min: 8 }).withMessage('Password should be at least 8 characters long!').matches(/[A-Z]/).withMessage('Password should contain at least one uppercase letter!').matches(/[a-z]/).withMessage('Password should contain at least one lowercase letter!').matches(/[0-9]/).withMessage('Password should contain at least one number!').matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password should contain at least one special character!'),
  body('role').isIn(['student', 'teacher', 'parent']).withMessage('You must select your user category: student, teacher, or parent!'),
];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, phoneNumber, email, username, password, role } = req.body;

    // Check if the user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    return res.status(400).json({ message: 'This user already exists. Try another email address' });
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
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

module.exports = { registerUser, validateRegister };