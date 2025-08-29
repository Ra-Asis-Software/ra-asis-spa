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

// @desc    edit quiz
// @route   PATCH /api/:quizId/edit
// @access  Private (Teachers)
export const editQuiz = asyncHandler(async (req, res) => {
  const { maxMarks, content, deadLine, createdBy, timeLimit } = req.body;
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
  let currentAnswers = JSON.parse(quiz.answers);

  const { changedContent, changedAnswers } = parsedContent.reduce(
    (acc, item) => {
      if (!item.id) {
        item.id = crypto.randomUUID(); //create id for new question items
      }
      if (item?.answer) {
        acc.changedAnswers.push({
          id: item.id,
          newAnswer: item.answer,
          marks: item.marks,
        });
      }
      const { answer, ...rest } = item; //separate answer from the object
      acc.changedContent.push(rest);

      return acc;
    },
    { changedContent: [], changedAnswers: [] }
  );

  //remove from the db answers whose question was deleted from the assignment
  currentAnswers = currentAnswers.filter((answer) => {
    return changedContent.some((question) => question.id === answer.id);
  });

  //update the current answers with the incoming edits (their new values)
  const replaceAnswers = currentAnswers.map((answer) => {
    const isAnswerModified = changedAnswers.find(
      (newAnswer) => newAnswer.id === answer.id
    );

    if (!isAnswerModified) {
      return answer;
    } else {
      return {
        id: isAnswerModified.id,
        answer: isAnswerModified.newAnswer,
        marks: isAnswerModified.marks,
      };
    }
  });

  //include edits that are bringing in new questions, or answers currently not present
  const veryNewAnswers = changedAnswers
    .filter(
      (newAnswer) =>
        !currentAnswers.some((answer) => answer.id === newAnswer.id)
    )
    .map((newAnswer) => ({
      id: newAnswer.id,
      answer: newAnswer.newAnswer,
      marks: newAnswer.marks,
    }));

  const newAnswers = [...replaceAnswers, ...veryNewAnswers]; //combine replaced answers with the new ones

  quiz.maxMarks = maxMarks;
  quiz.content = JSON.stringify(changedContent);
  quiz.answers = JSON.stringify(newAnswers);
  quiz.deadLine = deadLine;
  quiz.timeLimit = JSON.parse(timeLimit);

  //clear existing files
  if (req.files?.length > 0 && quiz.files?.length > 0) {
    await Promise.all(
      quiz.files.map((file) =>
        fs
          .unlink(file.filePath)
          .catch((err) => console.error("File delete error:", err))
      )
    );
  }

  //add new files
  quiz.files = req.files?.map((file) => ({
    filePath: file.path,
    fileName: file.originalname,
    fileSize: file.size,
    mimetype: file.mimetype,
  }));

  await quiz.save();

  //populate the quiz with unitName and code before sending back
  const populatedQuiz = await quiz.populate("unit");

  return res.status(200).json({
    message: "Quiz Edited Successfully",
    quiz: populatedQuiz,
  });
});
