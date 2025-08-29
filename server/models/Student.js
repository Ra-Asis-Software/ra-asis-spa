import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  bio: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  units: [{ type: mongoose.Schema.Types.ObjectId, ref: "Unit" }],
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }],
  quizSubmissions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "QuizSubmission" },
  ],
  calendar: [{ title: String, description: String, date: Date }],
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
