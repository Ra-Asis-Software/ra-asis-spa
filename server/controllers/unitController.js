import asyncHandler from "express-async-handler";
import { validationResult, matchedData } from "express-validator";
import Assignment from "../models/Assignment.js";
import Unit from "../models/Unit.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
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

  await Unit.create({ unitCode, unitName, createdBy: req.user._id });

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

  return res
    .status(200)
    .json({ message: "Students fetched successfully", students });
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

  const teachers = await Teacher.find({ units: unit._id })
    .populate("bio")
    .populate({
      path: "units",
      match: { _id: unit._id },
      populate: {
        path: "assignments",
        populate: {
          path: "unit",
          select: "unitCode unitName _id",
        },
      },
    });

  return res
    .status(200)
    .json({ message: "Teachers fetched successfully", teachers });
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

//@desc Enroll for a unit
//@route PATCH /api/unit/enroll-unit
//@access Private (Student)
export const enrollUnit = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //get student id and validated unitCode
  const { id } = req.user;
  const { unitCodes } = matchedData(req);

  //fetch the provided units
  const matchedUnits = await Unit.find({ unitCode: { $in: unitCodes } });

  const matchedUnitsIds = matchedUnits.map((unit) => unit._id);

  if (matchedUnitsIds.length !== unitCodes.length) {
    return res.status(400).json({
      message: "One or more unit codes are invalid",
      found: matchedUnits.map((unit) => unit.unitCode),
      missing: unitCodes.filter(
        (code) => !matchedUnits.some((unit) => unit.unitCode === code)
      ),
    });
  }

  const isStudent = await User.findOne({ _id: id, role: "student" });

  if (!isStudent) {
    return res.status(404).json({ message: "Invalid Student credentials" });
  }

  await Student.updateOne(
    { bio: isStudent._id },
    { $addToSet: { units: { $each: matchedUnitsIds } } },
    { upsert: true }
  );

  return res
    .status(201)
    .json({ message: `Student Units successfully updated` });
});

// @desc    Get assignment summary for a unit
// @route   GET /api/unit/assignment-summary/:unitCode
// @access  Private (Student)
export const getAssignmentSummaryByUnit = asyncHandler(async (req, res) => {
  const { unitCode } = req.params;

  const unit = await Unit.findOne({ unitCode });

  if (!unit) {
    return res.status(404).json({ message: "Unit not found" });
  }

  const assignments = await Assignment.find({ unit: unit._id });

  const total = assignments.length || 1;
  const completed = assignments.filter((a) => a.status === "completed").length;
  const pending = assignments.filter((a) => a.status === "pending").length;
  const overdue = assignments.filter((a) => a.status === "overdue").length;

  return res.json({
    completed: Math.round((completed / total) * 100),
    pending: Math.round((pending / total) * 100),
    overdue: Math.round((overdue / total) * 100),
  });
});

// @desc    Get units for a user
// @route   GET /api/unit/get-units-by-user
// @access  Public
export const getUnitsForUser = asyncHandler(async (req, res) => {
  const units =
    req.user.role === "teacher"
      ? await Teacher.findOne({ bio: req.user._id }, "units").populate({
          path: "units",
          select: "_id unitName unitCode",
        })
      : req.user.role === "student" &&
        (await Student.findOne({ bio: req.user._id }, "units").populate({
          path: "units",
          select: "_id unitName unitCode",
        }));

  if (!units) return res.status(404).json({ message: "Units not found" });

  return res.status(200).json(
    units.units.map((unit) => ({
      id: unit._id,
      name: unit.unitName,
      code: unit.unitCode,
    }))
  );
});
