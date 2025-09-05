import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
    submissionType: {
      type: String,
      enum: ["text", "file", "mixed"],
      required: true,
    },
    content: { type: String }, // I made this optional for file-based assignments,
    answers: { type: String }, // for auto-graded questions
    files: [
      {
        filePath: { type: String, required: true },
        fileName: { type: String, required: true },
        fileSize: { type: Number },
        mimetype: { type: String },
      },
    ], // Store file paths/URLs if submissionType=file
    deadLine: { type: String, required: true },
    maxMarks: { type: Number },
    status: {
      type: String,
      enum: ["pending", "completed", "overdue"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timeLimit: {
      value: Number,
      unit: {
        type: String,
        enum: ["seconds", "minutes", "hours"],
        default: "minutes",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Specify virtual fields for counts
quizSchema.virtual("submissionCount", {
  ref: "QuizSubmission",
  localField: "_id",
  foreignField: "quiz",
  count: true,
});

quizSchema.virtual("enrolledStudentsCount", {
  ref: "Student",
  localField: "unit",
  foreignField: "units",
  count: true,
});

// Enable virtuals in queries
quizSchema.set("toObject", { virtuals: true });
quizSchema.set("toJSON", { virtuals: true });

// Indexes for frequently queried unit and deadLine fields
quizSchema.index({ unit: 1, deadLine: 1 });

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
