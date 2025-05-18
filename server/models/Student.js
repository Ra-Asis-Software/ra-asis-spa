const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    bio: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    units: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' }],
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
    calender: [{ title: String, description: String, date: Date }]
})

const Student = mongoose.model('Student', studentSchema)

module.exports = Student