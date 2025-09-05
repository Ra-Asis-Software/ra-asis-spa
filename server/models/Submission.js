import mongoose from "mongoose";
import { timeLeft } from "../utils/assignment.js";

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  content: { type: String },
  // Multer handles file uploads
  files: [
    {
      filePath: { type: String, required: true },
      fileName: { type: String, required: true },
      fileSize: { type: Number },
      mimetype: { type: String },
    },
  ],
  marks: { type: Number },
  feedBack: { type: String },
  submissionStatus: {
    //this has to do with the time student submitted
    type: String,
    enum: ["on-time", "overdue"],
    default: "on-time",
  },
  gradingStatus: {
    //this has to do with where the teacher has reached in grading
    type: String,
    enum: ["submitted", "graded", "in-progress"],
    default: "submitted",
  },
  submittedAt: { type: Date, default: Date.now() },
});

// Indexes for frequently queried assignment, student and status fields
submissionSchema.index({ assignment: 1, student: 1, status: 1 });

// Ensure content is required for submissionType: "text" and files for submissionType: "file".
submissionSchema.pre("validate", function (next) {
  const assignment = mongoose.model("Assignment").findById(this.assignment);
  if (assignment.submissionType === "text" && !this.content) {
    throw new Error("Text submissions require 'content' field.");
  }
  if (
    assignment.submissionType === "file" &&
    (!this.files || this.files.length === 0)
  ) {
    throw new Error("File submissions require at least one file.");
  }
  next();
});

// Automatically set status: "overdue" if submission is late
submissionSchema.pre("save", async function (next) {
  if (this.isNew) {
    const assignment = await mongoose
      .model("Assignment")
      .findById(this.assignment);
    if (assignment && timeLeft(assignment.deadLine) < 0) {
      this.submissionStatus = "overdue";
    }
  }
  next();
});

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
