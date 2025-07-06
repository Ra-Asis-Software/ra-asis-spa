// @route   GET /api/unit/assignment-summary/:unitCode
import Assignment from "../models/Assignment.js";

export const getAssignmentSummaryByUnit = asyncHandler(async (req, res) => {
  const { unitCode } = req.params;

  const unit = await Unit.findOne({ unitCode });

  if (!unit) {
    return res.status(404).json({ message: "Unit not found" });
  }

  const assignments = await Assignment.find({ unit: unit._id });

  const total = assignments.length || 1; 
  const completed = assignments.filter(a => a.status === "completed").length;
  const pending = assignments.filter(a => a.status === "pending").length;
  const overdue = assignments.filter(a => a.status === "overdue").length;

  return res.json({
    completed: Math.round((completed / total) * 100),
    pending: Math.round((pending / total) * 100),
    overdue: Math.round((overdue / total) * 100),
  });
});
