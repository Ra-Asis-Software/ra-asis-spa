const mongoose = require('mongoose')

const parentSchema = new mongoose.Schema({
    bio: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
})

const Parent = mongoose.model('Parent', parentSchema)

module.exports = Parent