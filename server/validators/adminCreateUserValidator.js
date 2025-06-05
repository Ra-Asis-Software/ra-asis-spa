import { body } from "express-validator";

// Validation Middleware for createUser route
export const validateCreateUser = [
  body("firstName")
    .notEmpty()
    .withMessage("You did not enter the user's first name!")
    .isAlpha()
    .withMessage("The first name should contain only letters!")
    .isLength({ min: 2 })
    .withMessage("The first name should be at least 2 characters long!"),
  body("lastName")
    .notEmpty()
    .withMessage("Please enter the user's last name!")
    .isAlpha()
    .withMessage("The last name should contain only letters!")
    .isLength({ min: 2 })
    .withMessage("The last name should be at least 2 characters long!"),
  body("phoneNumber")
    .notEmpty()
    .withMessage("Please enter the user's phone number!")
    .isNumeric()
    .withMessage("Phone number should contain only numbers")
    .isLength({ min: 10, max: 10 })
    .withMessage("The phone number must be exactly 10 digits"),
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address for the user!"),
  body("username")
    .notEmpty()
    .withMessage("Please specify the user's username!")
    .isLowercase()
    .withMessage("Username should be in lowercase")
    .isLength({ min: 3 })
    .withMessage("Username should be at least 3 characters long")
    .matches(/^[a-z]+$/)
    .withMessage(
      "Username should contain only lowercase letters, no special characters!"
    ),
  body("password")
    .notEmpty()
    .withMessage("Please enter a strong password for the user!")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters long!")
    .matches(/[A-Z]/)
    .withMessage("Password should contain at least one uppercase letter!")
    .matches(/[a-z]/)
    .withMessage("Password should contain at least one lowercase letter!")
    .matches(/[0-9]/)
    .withMessage("Password should contain at least one number!")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password should contain at least one special character!"),
  body("role")
    .isIn(["student", "teacher", "parent"])
    .withMessage(
      "You must select the user's role in the system: student, teacher, or parent!"
    ),
];
