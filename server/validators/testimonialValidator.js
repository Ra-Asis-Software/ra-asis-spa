import { body, validationResult } from "express-validator";

export const validateTestimonial = [
  body("title").trim(),

  body("testimonial")
    .trim()
    .isLength({ min: 175 })
    .withMessage("Please provide a testimonial longer than 175 characters"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
