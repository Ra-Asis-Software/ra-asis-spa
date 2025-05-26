import jwt from "jsonwebtoken";

const generateToken = (id, firstName, lastName, role) => {
  return jwt.sign({ id, firstName, lastName, role }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token will expire in 30 days
  });
};

export default generateToken;
