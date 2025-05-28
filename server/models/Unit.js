import mongoose from "mongoose";
import Teacher from "./Teacher.js";
import Student from './Student.js'

const unitSchema = new mongoose.Schema({
  unitCode: { type: String, unique: true, required: true },
  unitName: { type: String, require: true },
});

unitSchema.index({ unitCode: 1, unique: true });

//a pre method to clean a unit's references on other models before deleting it
unitSchema.pre('deleteOne', async function(next) {
  const unit = await this.model.findOne(this.getQuery())
  try {
    await Teacher.updateMany({}, { $pull: { units: unit._id } })
    await Student.updateMany({}, { $pull: { units: unit._id } })
    next()
  }catch(error) {
    next(error)
  }
})

const Unit = mongoose.model("Unit", unitSchema);

export default Unit;
