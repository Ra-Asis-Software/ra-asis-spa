const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
    unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
    submissionType: { type: String, enum: ['text', 'file'] },
    content: { type: String, required: true },
    gradingCriteria: [{ type: String }],
    deadLine: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
})

const Assignment = mongoose.model('Assignment', assignmentSchema)

module.exports = Assignment