const express = require('express');
const { registerUser, validateRegister, verifyEmail, loginUser } = require('../controllers/authController');

const router = express.Router();

// Route for user registration
router.post('/register', validateRegister, registerUser);

//Route for email verification
router.get('/verify-email/:token', verifyEmail);

// Route for user login
router.post('/login', loginUser);


module.exports = router;