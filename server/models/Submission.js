const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema({
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
    content: { type: String },
    file: { type: Buffer },
    marks: { type: Number },
    feedBack: { type: String },
    submittedAt: { type: Date }
})

const Submission = mongoose.model('Submission', submissionSchema)

module.exports = Submission