import asyncHandler from "express-async-handler";
import Unit from "../models/Unit.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import { validationResult, matchedData } from "express-validator";
import Student from "../models/Student.js";

// @desc    Create a new unit
// @route   POST /api/unit/add-unit
// @access  Private (Admin)
export const addUnit = asyncHandler(async (req, res) => {
  //check and return any errors caught during validation of the fields in the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //get sanitized data that has been validated from unitValidator
  const { unitCode, unitName } = matchedData(req);

  //check if unit exists, regardless of case
  const unitExists = await Unit.findOne({
    unitCode: { $regex: `^${unitCode}$`, $options: "i" },
  });

  if (unitExists) {
    return res.status(409).json({
      message: `Unit Code ${unitCode} already Exists`,
      conflict: "unitCode",
    });
  }

  await Unit.create({ unitCode, unitName });

  return res.status(201).json({ message: `Unit successfully created` });
});

// @desc    Assign a unit
// @route   PATCH /api/unit/assign-unit
// @access  Private (Admin)
export const assignUnit = asyncHandler(async (req, res) => {
  //errors caught during validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //get validated data from unitValidator
  const { email, unitCode } = matchedData(req);

  const unitExists = await Unit.findOne({
    unitCode: { $regex: `^${unitCode}$`, $options: "i" },
  });

  if (!unitExists)
    return res
      .status(404)
      .json({ message: "The requested unit could not be found" });

  //use email and role to identify the teacher
  const isTeacher = await User.findOne({ email, role: "teacher" });

  if (!isTeacher)
    return res.status(404).json({ message: "Invalid Teacher credentials" });

  //use the _id of the current User to update their Teacher document
  //add the unit to the units array if it doesn't exist in the teacher's document
  //upsert creates a new document if no document matches the criteria
  // We might need to use a transaction here for data consistency
  await Teacher.updateOne(
    { bio: isTeacher._id },
    { $addToSet: { units: unitExists._id } },
    { upsert: true }
  );

  return res
    .status(201)
    .json({ message: "Unit has been successfully Assigned" });
});

// @desc    Delete a unit
// @route   DELETE /api/unit/delete-unit
// @access  Private (Admin)
export const deleteUnit = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { unitCode } = matchedData(req);

  const unit = await Unit.findOne({ unitCode });

  if (!unit) {
    return res
      .status(404)
      .json({ message: "The specified unit does not exist" });
  }

  await unit.deleteOne();
  return res
    .status(200)
    .json({ message: `Unit ${unitCode} has successfully been deleted` });
});

// @desc    Get students by unit
// @route   GET /api/unit/get-students-by-unit
// @access  Public
export const getStudents = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { unitCode } = matchedData(req);
  const unit = await Unit.findOne({ unitCode });

  if (!unit) {
    return res
      .status(404)
      .json({ message: "The specified unit does not exist" });
  }

  const students = await Student.find({ units: unit._id });

  return res.status(200).json({ message: "success", data: students });
});

// @desc    Get teachers by unit
// @route   GET /api/unit/get-teachers-by-unit
// @access  Public
export const getTeachers = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { unitCode } = matchedData(req);
  const unit = await Unit.findOne({ unitCode });

  if (!unit) {
    return res
      .status(404)
      .json({ message: "The specified unit does not exist" });
  }

  const teachers = await Teacher.find({ units: unit._id }).populate("bio");

  return res.status(200).json({ message: "success", data: teachers });
});

// @desc    Get all units
// @route   GET /api/unit/get-all-units
// @access  Public
export const getAllUnits = asyncHandler(async (req, res) => {
  const units = await Unit.find({}, "unitCode unitName");

  return res
    .status(200)
    .json({ success: "Unit retrieval successful", data: units });
});
