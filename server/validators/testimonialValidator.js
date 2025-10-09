import { body, validationResult } from "express-validator";

export const validateTestimonial = [
  body("groupName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Group name must be between 3 and 50 characters"),

  body("testimonial")
    .trim()
    .isLength({ min: 20, max: 250 })
    .withMessage("Please provide a testimonial between 20 and 250 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
