import { Router } from "express";
import {
  approveTestimonial,
  deleteTestimonial,
  getAllTestimonials,
  getApprovedTestimonials,
  getUnApprovedTestimonials,
  submitTestimonial,
} from "../controllers/testimonialControllers.js";
import { hasRole } from "../middleware/checkUserRole.js";
import { validateTestimonial } from "../validators/testimonialValidator.js";

const router = Router();

router.post(
  "/submit",
  hasRole("teacher", "student", "parent"),
  validateTestimonial,
  submitTestimonial
);

//get both approved and not-approved testimonials
router.get("/all", hasRole("administrator"), getAllTestimonials);

//get not-approved testimonials
router.get(
  "/not-approved",
  hasRole("administrator"),
  getUnApprovedTestimonials
);

//get approved testimonials
router.get("/approved", getApprovedTestimonials);

//admin approves testimonial
router.patch("/approve/:id", hasRole("administrator"), approveTestimonial);

// reject/delete testimonial
router.delete("/delete/:id", hasRole("administrator"), deleteTestimonial);

export default router;
