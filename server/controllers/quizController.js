import asyncHandler from "express-async-handler";
import Unit from "../models/Unit.js";
import Quiz from "../models/Quiz.js";
import Teacher from "../models/Teacher.js";
import QuizSubmission from "../models/QuizSubmission.js";
import Student from "../models/Student.js";
import {
  prepareAssessment,
  prepareEditedAssessment,
  submissionMadeOnTime,
  timeLeft,
} from "../utils/assignment.js";
import fs from "fs/promises";
import mongoose from "mongoose";

// @desc    Create a quiz
// @route   POST /api/quizzes
// @access  Private (Admin/Teacher)
export const createQuiz = asyncHandler(async (req, res) => {
  const {
    title,
    unitId,
    submissionType,
    deadLine,
    maxMarks,
    content,
    timeLimit,
    fileMarks,
  } = req.body;

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

  const parsedTimeLimit = JSON.parse(timeLimit);
  //ensure time limit is set
  if (!parsedTimeLimit.value || !parsedTimeLimit.unit) {
    return res.status(422).json({ message: "The time limit is not set" });
  }

  //get answers from auto graded questions
  const parsedContent = JSON.parse(content);
  const { newData, correctAnswers } = prepareAssessment(parsedContent);

  // Create quiz
  const quiz = await Quiz.create({
    title,
    unit: unitId,
    submissionType,
    deadLine,
    maxMarks,
    fileMarks,
    timeLimit: parsedTimeLimit,
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

  // Link quiz to unit
  unit.quizzes.push(quiz._id);
  await unit.save();

  //populate the quiz before sending back
  const populatedQuiz = await quiz.populate("unit");

  res.status(201).json({
    message: "Quiz created successfully",
    quiz: populatedQuiz,
  });
});

// @desc    edit quiz
// @route   PATCH /api/quizzes/:quizId/edit
// @access  Private (Teachers, Admins)
export const editQuiz = asyncHandler(async (req, res) => {
  const { maxMarks, content, deadLine, createdBy, timeLimit, fileMarks } =
    req.body;
  const { quizId } = req.params;

  //check existence of quiz
  //ensure the creator is the editor
  const quiz = await Quiz.findOne({
    _id: quizId,
    createdBy: req.user._id,
  });

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  //check the changes made
  const parsedContent = JSON.parse(content);
  const { newData, newAnswers } = prepareEditedAssessment(parsedContent);

  quiz.maxMarks = maxMarks;
  quiz.fileMarks = fileMarks;
  quiz.content = JSON.stringify(newData);
  quiz.answers = JSON.stringify(newAnswers);
  quiz.deadLine = deadLine;
  quiz.timeLimit = JSON.parse(timeLimit);

  //clear existing files if new files were added
  if (req.files?.length > 0 && quiz.files?.length > 0) {
    await Promise.all(
      quiz.files.map((file) =>
        fs
          .unlink(file.filePath)
          .catch((err) => console.error("File delete error:", err))
      )
    );
  }

  if (req.files?.length > 0) {
    //add new files
    quiz.files = req.files?.map((file) => ({
      filePath: file.path,
      fileName: file.originalname,
      fileSize: file.size,
      mimetype: file.mimetype,
    }));
  }

  await quiz.save();

  //populate the quiz with unitName and code before sending back
  const populatedQuiz = await quiz.populate("unit");

  return res.status(200).json({
    message: "Quiz Edited Successfully",
    quiz: populatedQuiz,
  });
});

// @desc    start quiz
// @route   PATCH /api/quizzes/start
// @access  Private (Students)
export const startQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.body;

  //confirm student exists
  const student = await Student.findOne({ bio: req.user._id });

  if (!student)
    return res
      .status(404)
      .json({ message: "An error occurred while validating your details" });

  const quiz = await Quiz.findById(quizId);
  if (!quiz)
    return res
      .status(404)
      .json({ message: "The quiz for this submission does not exist" });

  //check existing submission
  const submissionExists = await QuizSubmission.findOne({ quiz: quizId });

  if (submissionExists)
    return res.status(409).json({ message: "You already submitted this quiz" });

  //create a submission with the startTime
  const submission = await QuizSubmission.create({
    quiz: quizId,
    student: student._id,
    startedAt: Date.now(),
  });

  //save the submission to the Student model to be used when retrieving student details
  student.quizSubmissions.push(submission._id);
  await student.save();

  //separate answers from the quiz
  const { answers, ...restOfQuiz } = quiz.toObject();

  return res
    .status(201)
    .json({ message: "The quiz has started", quiz: restOfQuiz });
});

// @desc    Submit a quiz
// @route   POST /api/quizzes/:quizId/submit
// @access  Private (Student)
export const submitQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const { content, time, autoSubmitted, submissionId } = req.body;

  //confirm student exists
  const student = await Student.findOne({ bio: req.user._id });

  if (!student)
    return res
      .status(404)
      .json({ message: "An error occurred while validating your details" });

  //check if the quiz was started
  const submission = await QuizSubmission.findOne({
    _id: submissionId,
    student: student._id,
    quiz: quizId,
  });

  if (!submission)
    return res.status(404).json({ message: "You have not started this quiz!" });

  if (["on-time", "locked-out"].includes(submission.submissionStatus))
    return res.status(409).json({ message: "You already submitted this quiz" });

  // fetch the quiz
  const quiz = await Quiz.findById(quizId);

  if (!quiz)
    return res
      .status(404)
      .json({ message: "The specified quiz does not exist" });

  //ensure that the submission has been made within the specified time
  const { timeLimit } = quiz.toObject();
  const { startedAt } = submission.toObject();

  if (!submissionMadeOnTime(startedAt, timeLimit))
    return res.status(403).json({
      message: "Your submission could not be accepted because it is late",
    });

  // Validate submission type
  if (quiz.submissionType === "text" && !content) {
    return res
      .status(400)
      .json({ message: "Text submission requires content" });
  }

  if (quiz.submissionType === "file" && !req.files) {
    return res.status(400).json({ message: "File submission requires upload" });
  }

  if (quiz.submissionType === "mixed" && !req.files && !content) {
    return res
      .status(400)
      .json({ message: "No text or files detected in the submission" });
  }

  //start the auto-grading process
  const parsedContent = JSON.parse(content);
  const markedContent = {};
  const answers = JSON.parse(quiz.answers);
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

  //load submission details
  submission.content = JSON.stringify(markedContent);
  submission.submittedAt = Date.now();
  submission.files = req.files?.map((file) => ({
    filePath: file.path,
    fileName: file.originalname,
    fileSize: file.size,
    mimetype: file.mimetype,
  }));
  submission.marks = total;
  submission.gradingStatus =
    complete === true
      ? "graded"
      : complete === false
      ? "in-progress"
      : "pending";
  submission.submissionStatus =
    autoSubmitted === "true" ? "locked-out" : "on-time";

  await submission.save();

  res.status(201).json({ success: "Quiz successfully submitted", submission });
});

//@desc   Delete a started but unsubmitted quiz
// @route   DELETE /api/quizzes/:quizId/submissions/:submissionId
// @access  Private (Student/Teacher/Admin)
export const deleteUnresolvedSubmission = asyncHandler(async (req, res) => {
  const { quizId, submissionId } = req.params;

  //confirm student exists
  const student = await Student.findOne({ bio: req.user._id });
  if (!student)
    return res
      .status(404)
      .json({ message: "An error occurred while validating your details" });

  //we run a transaction to ensure submission is removed from QuizSubmission and from Student
  try {
    await mongoose.connection.transaction(async (session) => {
      await QuizSubmission.findOneAndDelete(
        { _id: submissionId, quiz: quizId, student: student._id },
        { session }
      );

      await Student.updateOne(
        { _id: student._id },
        { $pull: { quizSubmissions: submissionId } },
        { session }
      );
    });

    res.status(200).json({
      message: "You can start your quiz now",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while resolving your quiz submission",
    });
  }
});

//@desc   Get a single submission for a quiz
// @route   GET /api/quizzes/:quizId/submissions/:submissionId
// @access  Private (Teacher/Admin)
export const getSubmission = asyncHandler(async (req, res) => {
  const { quizId, submissionId } = req.params;

  const submission = await QuizSubmission.findOne({
    _id: submissionId,
    quiz: quizId,
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

//@desc GET quiz details
// @route   GET /api/quizzes/:id/details
// @access  Private
export const getQuizDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const quiz = await Quiz.findById(id)
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

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  res.status(200).json({
    ...quiz.toObject(),
  });
});

// @desc    Get quizzes for a unit
// @route   GET /api/quizzes/:unitId/quizzes
// @access  Private (Students/Teachers/Admins)
export const getQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ unit: req.params.unitId })
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

  res.status(200).json(quizzes);
});

// @desc    Get quizzes for a teacher
// @route   GET /api/quizzes/get-quizzes-for-teacher
// @access  Private (Teachers/Admins)
export const getQuizzesForTeacher = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find({ createdBy: req.user._id })
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

  res.status(200).json(quizzes);
});

// @desc    Get submissions for a quiz
// @route   GET /api/quizzes/:quizId/submissions?page=page&limit=limit
// @access  Private (Teacher/Admin)
export const getSubmissions = asyncHandler(async (req, res) => {
  //implementing pagination to cater for a class with many students
  const page = Number(req.query.page) ?? 1;
  const limit = Number(req.query.limit) ?? 50;

  const skip = (page - 1) * limit;

  const submissions = await QuizSubmission.find({
    quiz: req.params.quizId,
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

// @desc    Grade a quiz (Teacher only)
// @route   PATCH /api/quizzes/:quizId/submissions/:submissionId/grade
// @access  Private (Teacher)
export const gradeQuizSubmission = asyncHandler(async (req, res) => {
  const { studentAnswers, comments } = req.body;
  const { quizId, submissionId } = req.params;

  const submission = await QuizSubmission.findOne({
    _id: submissionId,
    quiz: quizId,
  });

  const quiz = await Quiz.findById(quizId);

  if (!submission || !quiz)
    return res
      .status(404)
      .json({ message: "Could not find the assessment details" });

  if (timeLeft(quiz.deadLine) > 0)
    return res.status(403).json({ message: "This Quiz is not yet due" });

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
