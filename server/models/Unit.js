import mongoose from "mongoose";
import Teacher from "./Teacher.js";
import Student from './Student.js'

const unitSchema = new mongoose.Schema({
  unitCode: { type: String, unique: true, required: true },
  unitName: { type: String, require: true },
});

unitSchema.index({ unitCode: 1, unique: true });

unitSchema.pre("findOneAndDelete", async () => {
  const unit = await this.model.findOne(this.getQuery())

  if(unit) {

  }
})

const Unit = mongoose.model("Unit", unitSchema);

export default Unit;
