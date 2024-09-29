const express = require('express');
const { registerUser, validateRegister } = require('../controllers/authController');

const router = express.Router();

// Route for user registration
router.post('/register', validateRegister, registerUser);


module.exports = router;