import asyncHandler from "express-async-handler";
import fs from "fs/promises";
import Assignment from "../models/Assignment.js";
import Unit from "../models/Unit.js";
import Teacher from "../models/Teacher.js";
import {
  prepareAssessment,
  prepareEditedAssessment,
} from "../utils/assignment.js";

// @desc    Create an assignment
// @route   POST /api/assignments
// @access  Private (Admin/Teacher)
export const createAssignment = asyncHandler(async (req, res) => {
  const { title, unitId, submissionType, deadLine, maxMarks, content } =
    req.body;

  // Validate the requested unit exists
  const unit = await Unit.findById(unitId);
  if (!unit) {
    return res.status(404).json({ message: "Unit not found" });
  }

  // If the user is a teacher, here I confirm they are assigned to the unit first
  if (req.user.role === "teacher") {
    const teacherAssigned = await Teacher.findOne({
      bio: req.user._id,
      units: unitId,
    });

    if (!teacherAssigned) {
      return res
        .status(403)
        .json({ message: "You are not assigned to this unit" });
    }
  }

  //get answers from auto graded questions
  const parsedContent = JSON.parse(content);
  const { newData, correctAnswers } = prepareAssessment(parsedContent);

  // Create assignment
  const assignment = await Assignment.create({
    title,
    unit: unitId,
    submissionType,
    deadLine,
    maxMarks,
    content: JSON.stringify(newData),
    answers: JSON.stringify(correctAnswers),
    createdBy: req.user._id,
    files: req.files?.map((file) => ({
      filePath: file.path,
      fileName: file.originalname,
      fileSize: file.size,
      mimetype: file.mimetype,
    })), // Multer saves files to "uploads/"
  });

  // Link assignment to unit
  unit.assignments.push(assignment._id);
  await unit.save();

  //populate the assignment before sending back
  const populatedAssignment = await assignment.populate("unit");

  res.status(201).json({
    message: "assignment created successfully",
    assignment: populatedAssignment,
  });
});

// @desc    edit assignment
// @route   PATCH /api/assignments/:assignmentId/edit
// @access  Private (Teachers)
export const editAssignment = asyncHandler(async (req, res) => {
  const { maxMarks, content, deadLine } = req.body;
  const { assignmentId } = req.params;

  //check existence of assignment
  //ensure the creator is the editor
  const assignment = await Assignment.findOne({
    _id: assignmentId,
    createdBy: req.user._id,
  });

  if (!assignment) {
    return res.status(404).json({ message: "No assignment found" });
  }

  //check the changes made
  const parsedContent = JSON.parse(content);

  const { newData, newAnswers } = prepareEditedAssessment(parsedContent);

  assignment.maxMarks = maxMarks;
  assignment.content = JSON.stringify(newData);
  assignment.answers = JSON.stringify(newAnswers);
  assignment.deadLine = deadLine;

  //clear existing files if new files were added
  if (req.files?.length > 0 && assignment.files?.length > 0) {
    await Promise.all(
      assignment.files.map((file) =>
        fs
          .unlink(file.filePath)
          .catch((err) => console.error("File delete error:", err))
      )
    );
  }

  if (req.files?.length > 0) {
    //add new files
    assignment.files = req.files?.map((file) => ({
      filePath: file.path,
      fileName: file.originalname,
      fileSize: file.size,
      mimetype: file.mimetype,
    }));
  }

  await assignment.save();

  //populate the assignment with unitName and code before sending back
  const populatedAssignment = await assignment.populate("unit");

  return res.status(200).json({
    message: "Assignment Edited Successfully",
    assignment: populatedAssignment,
  });
});

// @desc    Get assignments for a unit
// @route   GET /api/assignments/:unitId/assignments
// @access  Private (Students/Teachers/Admins)
export const getAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({ unit: req.params.unitId })
    .populate({
      path: "unit",
      select: "unitCode unitName",
    })
    .populate({
      path: "submissionCount",
      select: "_id",
    })
    .populate({
      path: "gradedCount",
      select: "_id",
    })
    .populate({
      path: "inProgressCount",
      select: "_id",
    })
    .populate({
      path: "enrolledStudentsCount",
      select: "_id",
    })
    .select("-answers");

  res.status(200).json(assignments);
});

// @desc    Get assignments for a teacher
// @route   GET /api/assignments/get-assignments-by-teacher
// @access  Private (Teachers/Admins)
export const getAssignmentsForTeacher = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({ createdBy: req.user._id })
    .populate({
      path: "unit",
      select: "unitCode unitName",
    })
    .populate({
      path: "submissionCount",
      select: "_id",
    })
    .populate({
      path: "gradedCount",
      select: "_id",
    })
    .populate({
      path: "inProgressCount",
      select: "_id",
    })
    .populate({
      path: "enrolledStudentsCount",
      select: "_id",
    })
    .select("-answers");

  res.status(200).json(assignments);
});

// @desc    Get details for a single assignment with counts
// @route   GET /api/assignments/:id/details
// @access  Private
export const getAssignmentDetails = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id)
    .populate({
      path: "submissionCount",
      select: "_id",
    })
    .populate({
      path: "enrolledStudentsCount",
      select: "_id",
    })
    .populate({
      path: "gradedCount",
      select: "_id",
    })
    .populate({
      path: "inProgressCount",
      select: "_id",
    })
    .populate({
      path: "unit",
      select: "unitCode unitName _id",
    })
    .select("-answers");

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }

  res.status(200).json({
    ...assignment.toObject(),
  });
});

// @desc    Delete an assignment (Admin only)
// @route   DELETE /api/assignments/:id
// @access  Private (Admin)
export const deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }

  // Delete associated files from uploads/
  if (assignment.files?.length > 0) {
    await Promise.all(
      assignment.files.map((file) =>
        fs
          .unlink(file.filePath)
          .catch((err) => console.error("File delete error:", err))
      )
    );
  }

  await assignment.deleteOne();
  res.status(200).json({ message: "Assignment deleted successfully" });
});
