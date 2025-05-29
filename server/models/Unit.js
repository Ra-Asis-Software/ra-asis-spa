import mongoose from "mongoose";
import Teacher from "./Teacher.js";
import Student from './Student.js'
import Assignment from "./Assignment.js";

const unitSchema = new mongoose.Schema({
  unitCode: { type: String, unique: true, required: true },
  unitName: { type: String, require: true },
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }]
});

unitSchema.index({ unitCode: 1, unique: true });

//a pre method to clean a unit's references on other models before deleting it
//query:true to ensure it is carried out on a query operation
unitSchema.pre('deleteOne', {document: false, query: true}, async function(next) {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const unit = await this.model.findOne(this.getQuery()).session(session)

    if(!unit) {
      throw new Error('Unit not found')
    }
    await Teacher.updateMany({ unit: unit._id }, { $pull: { units: unit._id } }, {session})
    await Student.updateMany({ unit: unit._id }, { $pull: { units: unit._id } }, {session})

    await session.commitTransaction()
    next()
  }catch(error) {
    await session.abortTransaction()
    next(error)
  } finally {
    session.endSession()
  }
})

const Unit = mongoose.model("Unit", unitSchema);

export default Unit;
