import mongoose from "mongoose";

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
  // We will need middleware for file uploads and a service like Firebase to store files and return URLs
  files: [{ type: String }], // For now let's use local storage
  marks: { type: Number },
  feedBack: { type: String },
  status: {
    type: String,
    enum: ["submitted", "graded", "overdue"],
    default: "submitted",
  },
  submittedAt: { type: Date, default: Date.now() },
});

// Indexes for frequently queried assignment, student and status fields
submissionSchema.index({ assignment: 1, student: 1, status: 1 });

// Here I ensure content is required for submissionType: "text" and files for submissionType: "file".
submissionSchema.pre("validate", function (next) {
  const assignment = mongoose.model("Assignment").findById(this.assignment);
  if (assignment.submissionType === "text" && !this.content) {
    throw new Error("Text submissions require 'content' field.");
  }
  if (assignment.submissionType === "file" && (!this.files || this.files.length === 0)) {
    throw new Error("File submissions require at least one file.");
  }
  next();
});

// Here I automatically set status: "overdue" if submission is late
submissionSchema.pre("save", async function (next) {
  if (this.isNew) {
    const assignment = await mongoose.model("Assignment").findById(this.assignment);
    if (assignment && this.submittedAt > assignment.deadLine) {
      this.status = "overdue";
    }
  }
  next();
});

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
