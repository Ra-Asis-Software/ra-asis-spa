const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token will expire in 30 days (Mnaeza Adjust accordingly baadae as needed)
  });
};

module.exports = generateToken;