import { body, validationResult } from "express-validator";

export const validateNewUnit = [
  body("unitCode")
    .exists()
    .withMessage("Unit Code missing")
    .trim()
    .isLength({ min: 4, max: 10 })
    .withMessage("Unit code must be between 4 and 10 characters")
    .matches(/^[a-zA-Z0-9 ]+$/)
    .withMessage("Unit code cannot contain symbols")
    .escape()
    .toLowerCase(),

  body("unitName")
    .exists()
    .withMessage("Unit Name missing")
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage("Unit Name must be between 5 and 50 characters")
    .escape(),
];

export const validateAssignUnit = [
  body("email")
    .exists()
    .withMessage("Teacher mail is missing")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email format"),

  body("unitCode")
    .exists()
    .withMessage("Missing Unit Code entry")
    .isLength({ min: 4, max: 10 })
    .withMessage("Unit code must be between 4 and 10 characters")
    .matches(/^[a-zA-Z0-9 ]+$/)
    .withMessage("Unit code cannot contain symbols")
    .escape()
    .toLowerCase(),
];

export const validateUpdateUnit = [
  body("unitCode")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Unit code must be at least 3 characters")
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("Unit code can only contain letters and numbers"),

  body("unitName")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Unit name must be at least 5 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateUnitCode = [
  body("unitCode")
    .exists()
    .withMessage("Missing Unit Code entry")
    .isLength({ min: 4, max: 10 })
    .withMessage("Unit code must be between 4 and 10 characters")
    .matches(/^[a-zA-Z0-9 ]+$/)
    .withMessage("Unit code cannot contain symbols")
    .escape()
    .toLowerCase(),
];

export const validateUnitCodes = [
  body("unitCodes")
    .isArray({ min: 1 })
    .withMessage("Unit codes must be provided as a non-empty array"),

  body("unitCode.*")
    .isLength({ min: 4, max: 10 })
    .withMessage("Each unit code must be between 4 and 10 characters")
    .matches(/^[a-zA-Z0-9 ]+$/)
    .withMessage("Unit codes cannot contain symbols")
    .escape()
    .toLowerCase(),
];
