import asyncHandler from "express-async-handler";
import fs from "fs/promises";
import Assignment from "../models/Assignment.js";
import Unit from "../models/Unit.js";

// @desc    Create an assignment
// @route   POST /api/assignments
// @access  Private (Admin/Teacher)
export const createAssignment = asyncHandler(async (req, res) => {
  const { title, unitId, submissionType, deadLine, maxMarks, content } = req.body;

  // Validate the requested unit exists
  const unit = await Unit.findById(unitId);
  if (!unit) {
    return res.status(404).json({ message: "Unit not found" });
  }

  // Create assignment
  const assignment = await Assignment.create({
    title,
    unit: unitId,
    submissionType,
    deadLine,
    maxMarks,
    content,
    createdBy: req.user._id,
    files: req.files?.map((file) => file.path), // Multer saves files to "uploads/"
  });

  // Link assignment to unit
  unit.assignments.push(assignment._id);
  await unit.save();

  res.status(201).json(assignment);
});

// @desc    Get assignments for a unit
// @route   GET /api/unit/:unitId/assignments
// @access  Private (Students/Teachers/Admins)
export const getAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({ unit: req.params.unitId });
  res.status(200).json(assignments);
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
          .unlink(file.path)
          .catch((err) => console.error("File delete error:", err))
      )
    );
  }

  await assignment.deleteOne();
  res.status(200).json({ message: "Assignment deleted successfully" });
});
