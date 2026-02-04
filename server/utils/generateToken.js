import jwt from "jsonwebtoken";

const generateToken = (id, firstName, lastName, role, createdBy) => {
  return jwt.sign(
    { id, firstName, lastName, role, createdBy },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

export default generateToken;
