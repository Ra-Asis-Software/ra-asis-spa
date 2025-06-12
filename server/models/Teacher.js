import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  bio: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  units: [{ type: mongoose.Schema.Types.ObjectId, ref: "Unit" }],
  calendar: [{ title: String, description: String, date: Date }],
});

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
