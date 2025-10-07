import { body, validationResult } from "express-validator";

export const validateTestimonial = [
  body("name")
    .trim()
    .isLength({ min: 5 })
    .withMessage("The name provided is too short"),

  body("title").trim(),

  body("testimonial")
    .trim()
    .isLength({ min: 20 })
    .withMessage("Please provide a testimonial longer than 20 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
