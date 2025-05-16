const mongoose = require('mongoose')

const unitSchema = new mongoose.Schema({
    unitCode: { type: String, unique: true, required: true },
    unitName: { type: String, require: true }
})

const Unit = mongoose.model('Unit', unitSchema)

module.exports = Unit