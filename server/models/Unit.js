import mongoose from "mongoose";

const unitSchema = new mongoose.Schema({
  unitCode: { type: String, unique: true, required: true },
  unitName: { type: String, require: true },
});

unitSchema.index({ unitCode: 1, unique: true });

const Unit = mongoose.model("Unit", unitSchema);

export default Unit;
