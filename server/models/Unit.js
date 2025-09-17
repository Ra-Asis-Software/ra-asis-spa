import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
  unitCode: { type: String, unique: true, required: true },
  unitName: { type: String, require: true },
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

unitSchema.index({ unitCode: 1, unique: true });

const Unit = mongoose.model("Unit", unitSchema);

export default Unit;
