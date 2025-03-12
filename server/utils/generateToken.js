const jwt = require("jsonwebtoken");

const generateToken = (id, firstName, lastName, role) => {
  return jwt.sign({ id, firstName, lastName, role }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token will expire in 1 day (Mnaeza Adjust accordingly baadae as needed)
  });
};

module.exports = generateToken;