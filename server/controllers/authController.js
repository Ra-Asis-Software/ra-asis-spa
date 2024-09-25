const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, phoneNumber, email, username, password, role } = req.body;

    // Check if the user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
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
    res.status(400);
    throw new Error('Invalid user data');
  }
});

module.exports = { registerUser };