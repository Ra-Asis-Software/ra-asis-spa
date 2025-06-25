import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
    submissionType: { type: String, enum: ["text", "file"], required: true },
    content: { type: String }, // I made this optional for file-based assignments
    files: [{ type: String }], // Store file paths/URLs if submissionType=file
    gradingCriteria: [{ type: String }],
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
  },
  {
    timestamps: true,
  }
);

// Specify virtual fields for counts
assignmentSchema.virtual("submissionCount", {
  ref: "Submission",
  localField: "_id",
  foreignField: "assignment",
  count: true,
});

assignmentSchema.virtual("enrolledStudentsCount", {
  ref: "Student",
  localField: "unit",
  foreignField: "units",
  count: true,
});

// Enable virtuals in queries
assignmentSchema.set("toObject", { virtuals: true });
assignmentSchema.set("toJSON", { virtuals: true });

// Indexes for frequently queried unit and deadLine fields
assignmentSchema.index({ unit: 1, deadLine: 1 });

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
