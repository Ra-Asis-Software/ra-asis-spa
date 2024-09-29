const express = require('express');
const { registerUser, validateRegister, verifyEmail } = require('../controllers/authController');

const router = express.Router();

// Route for user registration
router.post('/register', validateRegister, registerUser);

//Route for email verification
router.get('/verify-email/:token', verifyEmail);


module.exports = router;