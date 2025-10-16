import asyncHandler from "express-async-handler";
import { validationResult, matchedData } from "express-validator";
import Assignment from "../models/Assignment.js";
import Unit from "../models/Unit.js";
import Teacher from "../models/Teacher.js";
import User from "../models/User.js";
import Student from "../models/Student.js";
import UnitRequest from "../models/UnitRequest.js";

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

// @desc    Assign users to units
// @route   PATCH /api/unit/multiple-assign-unit
// @access  Private (Admin)
export const multipleAssignUnit = asyncHandler(async (req, res) => {
  const { unitIds, userIds } = req.body;

  if (
    !unitIds ||
    !userIds ||
    !Array.isArray(unitIds) ||
    !Array.isArray(userIds)
  ) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    // Get the units
    const units = await Unit.find({ _id: { $in: unitIds } });
    if (units.length !== unitIds.length) {
      return res.status(404).json({ message: "One or more units not found" });
    }

    // Get the users and their roles
    const users = await User.find({ _id: { $in: userIds } });
    if (users.length !== userIds.length) {
      return res.status(404).json({ message: "One or more users not found" });
    }

    // Assign users to units based on their role
    for (const user of users) {
      if (user.role === "teacher") {
        // Check if teacher already has 5 units
        const teacher = await Teacher.findOne({ bio: user._id }).populate(
          "units"
        );
        if (teacher && teacher.units.length >= 5) {
          return res.status(400).json({
            message: `Teacher ${user.firstName} ${user.lastName} already has maximum allowed units (5)`,
          });
        }

        // Add units to teacher
        await Teacher.updateOne(
          { bio: user._id },
          { $addToSet: { units: { $each: unitIds } } },
          { upsert: true }
        );
      } else if (user.role === "student") {
        // Add units to student
        await Student.updateOne(
          { bio: user._id },
          { $addToSet: { units: { $each: unitIds } } },
          { upsert: true }
        );
      }
    }

    res.status(200).json({ message: "Users assigned to units successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign users to units" });
  }
});

// @desc    Get available teachers for unit assignment (with less than 5 units)
// @route   GET /api/unit/available-teachers
// @access  Private (Admin)
export const getAvailableTeachers = asyncHandler(async (req, res) => {
  try {
    // Get all teachers to filter those with less than 5 units
    const teachers = await Teacher.find()
      .populate("bio", "firstName lastName email role")
      .populate("units", "unitCode unitName");

    // Filter teachers with less than 5 units
    const availableTeachers = teachers.filter(
      (teacher) => teacher.units.length < 5
    );

    res.status(200).json({ teachers: availableTeachers });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch available teachers" });
  }
});

// @desc    Get available students for unit assignment (not in all units)
// @route   GET /api/unit/available-students
// @access  Private (Admin)
export const getAvailableStudents = asyncHandler(async (req, res) => {
  try {
    const students = await Student.find()
      .populate("bio", "firstName lastName email role")
      .populate("units", "unitCode unitName");

    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch available students" });
  }
});

// @desc    Update a unit
// @route   PUT /api/unit/update-unit/:id
// @access  Private (Admin)
export const updateUnit = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { unitCode, unitName } = matchedData(req);

  // Find the unit to update
  const unit = await Unit.findById(id);
  if (!unit) {
    return res.status(404).json({ message: "Unit not found" });
  }

  // Check if new unit code conflicts with existing units (excluding current unit)
  if (unitCode && unitCode !== unit.unitCode) {
    const unitExists = await Unit.findOne({
      unitCode: { $regex: `^${unitCode}$`, $options: "i" },
      _id: { $ne: id },
    });

    if (unitExists) {
      return res.status(409).json({
        message: `Unit Code ${unitCode} already exists`,
        conflict: "unitCode",
      });
    }
  }

  // Update the unit
  if (unitCode) unit.unitCode = unitCode;
  if (unitName) unit.unitName = unitName;

  await unit.save();

  res.status(200).json({
    message: "Unit updated successfully",
    unit: {
      _id: unit._id,
      unitCode: unit.unitCode,
      unitName: unit.unitName,
    },
  });
});

// @desc    Delete a unit
// @route   DELETE /api/unit/delete-unit/:id
// @access  Private (Admin)
export const deleteUnit = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== "administrator") {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const unit = await Unit.findById(id);

  if (!unit) {
    return res
      .status(404)
      .json({ message: "The specified unit does not exist" });
  }

  await Promise.all([
    // Update teachers where this unit is referenced as units
    Teacher.updateMany({ units: id }, { $pull: { units: id } }),

    // Update students where this unit is referenced as units
    Student.updateMany({ units: id }, { $pull: { units: id } }),

    // Finally delete the unit
    Unit.deleteOne({ _id: id }),
  ]);

  return res
    .status(200)
    .json({ message: `Unit has successfully been deleted` });
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

// @desc    Get all unit assignment requests
// @route   GET /api/unit/requests
// @access  Private (Admin)
export const getUnitRequests = asyncHandler(async (req, res) => {
  try {
    const requests = await UnitRequest.find()
      .populate("teacher", "firstName lastName email")
      .populate("unit", "unitCode unitName")
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch unit requests" });
  }
});

// @desc    Create unit assignment request (for teachers)
// @route   POST /api/unit/requests
// @access  Private (Teacher)
export const createUnitRequest = asyncHandler(async (req, res) => {
  const { unitCode } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: "Authentication required. Please log in again.",
    });
  }

  const teacherId = req.user.id;

  // Check if user is actually a teacher
  const user = await User.findById(teacherId);
  if (!user || user.role !== "teacher") {
    return res.status(403).json({
      message: "Only teachers can request unit assignments",
    });
  }

  // Check if teacher already has 5 units
  const teacher = await Teacher.findOneAndUpdate(
    { bio: teacherId },
    {
      $setOnInsert: {
        bio: teacherId,
        units: [],
      },
    },
    {
      new: true,
      upsert: true,
    }
  ).populate("units");

  if (!teacher) {
    return res.status(404).json({
      message: "Your details could not be found. Please contact administrator.",
    });
  }

  if (teacher.units.length >= 5) {
    return res.status(400).json({
      message: "You can only be assigned to a maximum of 5 units",
    });
  }

  // Check if unit exists
  const unit = await Unit.findOne({ unitCode });
  if (!unit) {
    return res.status(404).json({ message: "Unit not found" });
  }

  // Check if teacher is already assigned to this unit
  const alreadyAssigned = teacher.units.some(
    (assignedUnit) => assignedUnit._id.toString() === unit._id.toString()
  );

  if (alreadyAssigned) {
    return res.status(400).json({
      message: "You are already assigned to this unit",
    });
  }

  // Check if request already exists
  const existingRequest = await UnitRequest.findOne({
    teacher: teacherId,
    unit: unit._id,
    status: "pending",
  });

  if (existingRequest) {
    return res.status(400).json({ message: "Request already submitted" });
  }

  // Create new request
  const request = await UnitRequest.create({
    teacher: teacherId,
    unit: unit._id,
    status: "pending",
  });

  // Populate the request
  await request.populate("teacher", "firstName lastName email");
  await request.populate("unit", "unitCode unitName");

  res.status(201).json({
    message: "Unit request submitted successfully",
    request,
  });
});

// @desc    Approve unit assignment request
// @route   PATCH /api/unit/requests/:requestId/approve
// @access  Private (Admin)
export const approveUnitRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const request = await UnitRequest.findById(requestId)
    .populate("teacher")
    .populate("unit");

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  if (request.status !== "pending") {
    return res.status(400).json({ message: "Request already processed" });
  }

  // Check if teacher already has 5 units
  const teacher = await Teacher.findOne({ bio: request.teacher._id });
  if (teacher.units.length >= 5) {
    return res.status(400).json({
      message: "Teacher already has maximum allowed units (5)",
    });
  }

  // Assign unit to teacher
  await Teacher.updateOne(
    { bio: request.teacher._id },
    { $addToSet: { units: request.unit._id } }
  );

  // Update request status
  request.status = "approved";
  await request.save();

  res.status(200).json({ message: "Unit request approved successfully" });
});

// @desc    Reject unit assignment request
// @route   PATCH /api/unit/requests/:requestId/reject
// @access  Private (Admin)
export const rejectUnitRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;

  const request = await UnitRequest.findById(requestId);
  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  if (request.status !== "pending") {
    return res.status(400).json({ message: "Request already processed" });
  }

  request.status = "rejected";
  await request.save();

  res.status(200).json({ message: "Unit request rejected successfully" });
});
