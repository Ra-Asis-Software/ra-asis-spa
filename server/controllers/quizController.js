import asyncHandler from "express-async-handler";
import Unit from "../models/Unit.js";
import Quiz from "../models/Quiz.js";
import Teacher from "../models/Teacher.js";

// @desc    Create a quiz
// @route   POST /api/quiz
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

  const { newContent, newAnswers } = parsedContent.reduce(
    (acc, item) => {
      const id = crypto.randomUUID();

      if (item.type === "question" && item.answer) {
        acc.newContent.push({
          type: item.type,
          data: item.data,
          answers: item.answers,
          id,
        }); // question with new ID
        acc.newAnswers.push({ id, answer: item.answer }); // matching answer
      } else {
        acc.newContent.push({ ...item, id }); //if not a question with answers, return original
      }

      return acc;
    },
    { newContent: [], newAnswers: [] }
  );

  // Create quiz
  const quiz = await Quiz.create({
    title,
    unit: unitId,
    submissionType,
    deadLine,
    maxMarks,
    timeLimit: parsedTimeLimit,
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

  // Link quiz to unit
  unit.quiz.push(quiz._id);
  await unit.save();

  //populate the quiz before sending back
  const populatedQuiz = await quiz.populate("unit");

  res.status(201).json({
    message: "Quiz created successfully",
    quiz: populatedQuiz,
  });
});
