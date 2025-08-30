import mongoose from "mongoose";

const quizSubmissionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  content: { type: String },
  files: [{ type: String }], // For now let's use local storage
  marks: { type: Number },
  feedBack: { type: String },
  submissionStatus: {
    //this has to do with the time student submitted
    type: String,
    enum: ["started", "on-time", "locked-out"],
    default: "started",
  },
  gradingStatus: {
    //this has to do with where the teacher has reached in grading
    type: String,
    enum: ["pending", "graded", "in-progress"],
    default: "pending",
  },
  startedAt: { type: Date, default: Date.now() },
  submittedAt: { type: Date },
});

// Indexes for frequently queried quizzes, student and status fields
quizSubmissionSchema.index({ assignment: 1, student: 1, status: 1 });

const QuizSubmission = mongoose.model("QuizSubmission", quizSubmissionSchema);

export default QuizSubmission;
