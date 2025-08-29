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
    enum: ["on-time", "locked-out"],
    default: "on-time",
  },
  gradingStatus: {
    //this has to do with where the teacher has reached in grading
    type: String,
    enum: ["submitted", "graded", "in-progress"],
    default: "submitted",
  },
  startedAt: { type: Date, default: Date.now() },
  submittedAt: { type: Date, default: Date.now() },
});

// Indexes for frequently queried quizzes, student and status fields
quizSubmissionSchema.index({ assignment: 1, student: 1, status: 1 });

const QuizSubmission = mongoose.model("QuizSubmission", quizSubmissionSchema);

export default QuizSubmission;
