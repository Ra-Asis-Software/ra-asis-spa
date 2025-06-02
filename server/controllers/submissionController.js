import asyncHandler from "express-async-handler";
import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";

// @desc    Submit an assignment
// @route   POST /api/assignments/:assignmentId/submit
// @access  Private (Student)
export const submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const { content } = req.body;

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }

  // Validate submission type
  if (assignment.submissionType === "text" && !content) {
    return res.status(400).json({ message: "Text submission requires content" });
  }

  if (assignment.submissionType === "file" && !req.files) {
    return res.status(400).json({ message: "File submission requires upload" });
  }

  const submission = await Submission.create({
    assignment: assignmentId,
    student: req.user._id,
    content,
    files: req.files?.map(file => file.path),
    status: new Date() > assignment.deadLine ? "overdue" : "submitted"
  });

  res.status(201).json(submission);
});

// @desc    Get submissions for an assignment
// @route   GET /api/assignments/:assignmentId/submissions
// @access  Private (Teacher/Admin)
export const getSubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ assignment: req.params.assignmentId });
  res.status(200).json(submissions);
});