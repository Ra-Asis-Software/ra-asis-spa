import asyncHandler from "express-async-handler";
import { matchedData } from "express-validator";
import Testimonial from "../models/Testimonial.js";
import User from "../models/User.js";

// @desc    Submit a testimonial
// @route   POST /api/testimonial/submit
// @access  Private (Student, Teacher, Parent)
export const submitTestimonial = asyncHandler(async (req, res) => {
  const { title, testimonial } = matchedData(req);
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user)
    return res.status(404).json({ message: "User could not be found!" });

  const testimonialExists = await Testimonial.findOne({ user: id });

  if (testimonialExists)
    return res
      .status(409)
      .json({ message: "Sorry, A testimonial from you already exists" });

  await Testimonial.create({
    user: id,
    title,
    testimonial,
    approved: false,
  });

  return res.status(201).json({
    message:
      "Your testimonial has been successfully submitted, pending approval",
  });
});

// @desc    Get all testimonials
// @route   GET /api/testimonials/all
// @access  Private (Admin)
export const getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({})
    .populate({
      path: "user",
      select: "firstName lastName",
    })
    .lean();

  const flattenedTestimonials = testimonials.map((t) => ({
    ...t,
    name: `${t.user?.firstName} ${t.user?.lastName}`,
    user: undefined,
  }));

  return res.status(200).json(flattenedTestimonials);
});

// @desc    Get testimonials not approved
// @route   GET /api/testimonials/not-approved
// @access  Private (Admin)
export const getUnApprovedTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ approved: false })
    .populate({
      path: "user",
      select: "firstName lastName",
    })
    .lean();

  const flattenedTestimonials = testimonials.map((t) => ({
    ...t,
    name: `${t.user?.firstName} ${t.user?.lastName}`,
    user: undefined,
  }));

  return res.status(200).json(flattenedTestimonials);
});

// @desc    Get approved testimonials
// @route   GET /api/testimonials/approved
// @access  Public
export const getApprovedTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ approved: true })
    .populate({
      path: "user",
      select: "firstName lastName",
    })
    .lean();

  const flattenedTestimonials = testimonials.map((t) => ({
    ...t,
    name: `${t.user?.firstName} ${t.user?.lastName}`,
    user: undefined,
  }));

  return res.status(200).json(flattenedTestimonials);
});

// @desc    Approve testimonials
// @route   PATCH /api/testimonials/approve/:id
// @access  Private (Admin)
export const approveTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const testimonial = await Testimonial.findById(id);

  if (!testimonial)
    return res
      .status(404)
      .json({ message: "Error! Could not find the testimonial" });

  testimonial.approved = true;
  await testimonial.save();

  return res.status(200).json({ message: "The Testimonial has been Approved" });
});

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/delete/:id
// @access  Private (Admin)
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Testimonial.findByIdAndDelete(id);

  return res.status(200).json({ message: "Testimonial deleted successfully" });
});
