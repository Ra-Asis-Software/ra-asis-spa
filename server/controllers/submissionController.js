import asyncHandler from "express-async-handler";
import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import Student from "../models/Student.js";
import mongoose from "mongoose";
import fs from "fs/promises";
import { timeLeft } from "../utils/assignment.js";

// @desc    Submit an assignment
// @route   POST /api/assignments/:assignmentId/submit
// @access  Private (Student)
export const submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const { content, time } = req.body;

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    return res.status(404).json({ message: "Assignment not found" });
  }

  // Validate submission type
  if (assignment.submissionType === "text" && !content) {
    return res
      .status(400)
      .json({ message: "Text submission requires content" });
  }

  if (assignment.submissionType === "file" && !req.files) {
    return res.status(400).json({ message: "File submission requires upload" });
  }

  if (assignment.submissionType === "mixed" && !req.files && !content) {
    return res
      .status(400)
      .json({ message: "No text or files detected in the submission" });
  }

  const student = await Student.findOne({ bio: req.user._id });

  if (!student)
    return res
      .status(404)
      .json({ message: "Your student profile could not be found" });

  //check if the student already submitted this assignment
  const submissionExists = await Submission.findOne({
    assignment: assignment._id,
    student: student._id,
  });

  if (submissionExists)
    return res
      .status(409)
      .json({ message: "A submission already Exists for this assignment" });

  //start the auto-grading process
  const parsedContent = JSON.parse(content);
  const markedContent = {};
  const answers = JSON.parse(assignment.answers);
  if (parsedContent) {
    for (const [questionId, userAnswer] of Object.entries(parsedContent)) {
      const answerIsThere = answers.find((answer) => answer.id === questionId);

      if (answerIsThere) {
        markedContent[questionId] = {
          userAnswer,
          correctAnswer: answerIsThere.answer,
          marks: userAnswer === answerIsThere.answer ? answerIsThere.marks : 0, //to be changed appropriately later
        };
        //markedContent is taking this form for confirmations and corrections later, if needed
      } else {
        markedContent[questionId] = {
          userAnswer,
          marks: null, //the assumption is that these are questions to be manually marked
        };
      }
    }
  }

  // compute total marks and grading completeness
  let total = 0;
  let complete = true;
  // null - marking has not started
  // false - marking is underway
  // true - marking is completed

  if (JSON.stringify(markedContent) === "{}") {
    complete = null;
  }
  for (const { marks } of Object.values(markedContent)) {
    if (marks === null) {
      complete = false; //questions to be manually marked are here, if true... the submission is 100% auto-graded
    } else {
      total += Number(marks);
      //for questions that will be manually marked later, the new marks will be added to this
    }
  }

  const submission = await Submission.create({
    assignment: assignmentId,
    student: student._id,
    content: JSON.stringify(markedContent),
    submittedAt: time,
    files: req.files?.map((file) => ({
      filePath: file.path,
      fileName: file.originalname,
      fileSize: file.size,
      mimetype: file.mimetype,
    })),
    marks: total,
    gradingStatus:
      complete === true
        ? "graded"
        : complete === false
        ? "in-progress"
        : "submitted",
  });

  //save the submission to the Student model to be used when retrieving student details
  student.submissions.push(submission._id);
  await student.save();

  res
    .status(201)
    .json({ success: "Assignment successfully submitted", submission });
});

// @desc    Get submissions for an assignment
// @route   GET /api/assignments/:assignmentId/submissions?page=page&limit=limit
// @access  Private (Teacher/Admin)
export const getSubmissions = asyncHandler(async (req, res) => {
  //implementing pagination to cater for a class with many students
  const page = Number(req.query.page) ?? 1;
  const limit = Number(req.query.limit) ?? 50;

  const skip = (page - 1) * limit;

  const submissions = await Submission.find({
    assignment: req.params.assignmentId,
  })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "student",
      select: "bio",
      populate: { path: "bio", select: "firstName lastName email" },
    })
    .lean();

  const formatted = submissions.map((sub) => ({
    ...sub,
    student: {
      ...sub.student.bio, // merge user info into student
    },
  }));

  res.status(200).json(formatted);
});

//@desc   Get a single submission for an assignment
// @route   GET /api/assignments/:assignmentId/submissions/:submissionId
// @access  Private (Teacher/Admin)
export const getSubmission = asyncHandler(async (req, res) => {
  const { assignmentId, submissionId } = req.params;

  const submission = await Submission.findOne({
    _id: submissionId,
    assignment: assignmentId,
  }).populate({
    path: "student",
    select: "bio",
    populate: { path: "bio", select: "firstName lastName email" },
  });

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  res.status(200).json(submission);
});

// @desc    Delete submission for an assignment
// @route   DELETE /api/assignments/submissions/:submissionId
// @access  Private (Student/Admin)
export const deleteSubmission = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;

  const submissionExists = await Submission.findById(submissionId);

  if (!submissionExists)
    return res.status(404).json({ error: "Submission does not exist" });

  const assignment = await Assignment.findById(submissionExists.assignment);

  if (!assignment)
    return res
      .status(404)
      .json({ error: "No assignment exists for this submission" });

  //check for lateness
  if (timeLeft(assignment.deadLine) < 20)
    return res.status(409).json({
      error: "You cannot revoke a submission 20 minutes to the deadline",
    });

  //transaction for deleting submission instance in submissions and for a student
  const session = await mongoose.startSession();

  await session.withTransaction(async () => {
    await Student.updateOne(
      { bio: req.user._id },
      {
        $pull: { submissions: submissionExists._id },
      },
      { session }
    );

    //remove files
    if (submissionExists.files?.length > 0) {
      await Promise.all(
        submissionExists.files.map((file) => {
          fs.unlink(file).catch((err) => {
            console.error("File delete error:", err);
            throw new Error("An error occurred while deleting the submission");
          });
        })
      );
    }

    await submissionExists.deleteOne({ session });
  });

  session.endSession();

  return res.status(200).json({ message: "Submission has been removed" });
});

// @desc    Grade an assignment (Teacher only)
// @route   PATCH /api/assignments/:assignmentId/submissions/:submissionId/grade
// @access  Private (Teacher)
export const gradeAssignmentSubmission = asyncHandler(async (req, res) => {
  const { studentAnswers, comments } = req.body;
  const { assignmentId, submissionId } = req.params;

  const submission = await Submission.findOne({
    _id: submissionId,
    assignment: assignmentId,
  });

  const assignment = await Assignment.findById(assignmentId);

  if (!submission || !assignment)
    return res
      .status(404)
      .json({ message: "Could not find the assessment details" });

  if (timeLeft(assignment.deadLine) > 0)
    return res.status(403).json({ message: "This Assignment is not yet due" });

  if (submission.gradingStatus === "graded")
    return res
      .status(403)
      .json({ message: "This submission is already graded" });

  const content = JSON.parse(submission.content);

  //calculate total marks
  let total = 0;
  for (const q of Object.entries(content)) {
    //we exclude auto-graded questions, check questions with no mark beforehand, and that an incoming mark is present
    //q[0] is the id, q[1] is an object with { marks, ||correctAnswer, userAnswer }
    const questionDetails = q[1];
    const questionId = q[0];
    if (
      !questionDetails.correctAnswer &&
      questionDetails.marks === null &&
      !studentAnswers[questionId].marks
    ) {
      return res
        .status(422)
        .json({ message: "Some questions have not been assigned marks" });
    }

    if (
      !questionDetails.correctAnswer &&
      questionDetails.marks === null &&
      studentAnswers[questionId].marks
    ) {
      questionDetails.marks = Number(studentAnswers[questionId].marks);
      content[questionId].marks = questionDetails.marks; //update the content with the new marks
    }

    total +=
      Number(questionDetails.marks) >= 0 ? Number(questionDetails.marks) : 0; //compute total marks
  }

  submission.content = JSON.stringify(content);
  submission.marks = total;
  submission.feedBack = comments;
  submission.gradingStatus = "graded";

  await submission.save();

  return res.status(200).json({ success: "Graded successfully" });
});
