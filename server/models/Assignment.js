const mongoose = require('mongoose')
const unitSchema = require('./Unit')

const assignmentSchema = new mongoose.Schema({
    unit: { type: mongoose.Schema.Types.ObjectId, ref: 'unitSchema' },
    content: { type: String, required: true },
    gradingCriteria: [{ type: String }],
    deadLine: { type: Date },
    
})

const Assignment = mongoose.model('Assignment', assignmentSchema)

module.exports = Assignment