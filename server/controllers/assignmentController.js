import asyncHandler from "express-async-handler";
import fs from "fs/promises";
import Assignment from "../models/Assignment.js";
import Unit from "../models/Unit.js";
import Teacher from "../models/Teacher.js";
import { v4 as uuidv4 } from "uuid";
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

  const { newContent, newAnswers } = parsedContent.reduce(
    (acc, item) => {
      const id = uuidv4();

      if (item[1] === "question" && item.length > 3) {
        acc.newContent.push([...item.slice(0, 3), id]); // question with new ID
        acc.newAnswers.push({ id, answer: item[3] }); // matching answer
      } else {
        acc.newContent.push([...item, id]); //if not a question with answers, return original
      }

      return acc;
    },
    { newContent: [], newAnswers: [] }
  );

  // Create assignment
  const assignment = await Assignment.create({
    title,
    unit: unitId,
    submissionType,
    deadLine,
    maxMarks,
    content: JSON.stringify(newContent),
    answers: JSON.stringify(newAnswers),
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
// @route   PATCH /api/:assignmentId/edit
// @access  Private (Teachers)
export const editAssignment = asyncHandler(async (req, res) => {
  const { maxMarks, content, deadLine, createdBy } = req.body;
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

  assignment.maxMarks = maxMarks;
  assignment.content = content;
  assignment.deadLine = deadLine;

  //clear existing files
  if (req.files?.length > 0 && assignment.files?.length > 0) {
    await Promise.all(
      assignment.files.map((file) =>
        fs
          .unlink(file.filePath)
          .catch((err) => console.error("File delete error:", err))
      )
    );
  }

  //add new files
  assignment.files = req.files?.map((file) => ({
    filePath: file.path,
    fileName: file.originalname,
    fileSize: file.size,
    mimetype: file.mimetype,
  }));

  await assignment.save();

  //populate the assignment with unitName and code before sending back
  const populatedAssignment = await assignment.populate("unit");

  return res.status(200).json({
    message: "Assignment Edited Successfully",
    assignment: populatedAssignment,
  });
});

// @desc    Get assignments for a unit
// @route   GET /api/:unitId/assignments
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
      path: "enrolledStudentsCount",
      select: "_id",
    });

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
      path: "unit",
      select: "unitCode unitName _id",
    });

  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }

  res.status(200).json({
    ...assignment.toObject(),
    submissionCount: assignment.submissionCount?.length || 0,
    enrolledStudentsCount: assignment.enrolledStudentsCount?.length || 0,
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
