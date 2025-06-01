import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },
  submissionType: { type: String, enum: ["text", "file"], required: true },
  content: { type: String }, // I made this optional for file-based assignments
  files: [{ type: String }], // Store file paths/URLs if submissionType=file
  gradingCriteria: [{ type: String }],
  deadLine: { type: Date, required: true },
  maxMarks: { type: Number },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
});

// Indexes for frequently queried unit and deadLine fields
assignmentSchema.index({ unit: 1, deadLine: 1 });

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
