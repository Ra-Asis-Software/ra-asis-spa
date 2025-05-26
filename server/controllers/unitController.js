const asyncHandler = require('express-async-handler')
const Unit = require('../models/Unit')
const Teacher = require('../models/Teacher')
const { validationResult } = require('express-validator')

const addUnit = asyncHandler(async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { unitCode, unitName } = req.body
    let normalizedUnitCode = unitCode.trim().toLowerCase()

    const unitExists = await Unit.findOne({ $expr: { $eq: [{ $toLower: "$unitCode" }, normalizedUnitCode] } })

    if(unitExists) {
        return res.status(409).json({ message: `Unit Code ${unitCode} already Exists` })
    }

    await Unit.create({ unitCode, unitName })

    return res.status(201).json({ message: `Unit successfully created` })
})

const assignUnit = asyncHandler( async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, unitCode } = req.body
    let normalizedUnitCode = unitCode.trim().toLowerCase()

    const unitExists = await Unit.findOne({ $expr: { $eq: [{ $toLower: "$unitCode" }, normalizedUnitCode] } })

    if(!unitExists) return res.status(404).json({ message: 'The requested unit could not be found' });

    const isTeacher = await Teacher.findOne({ email })

    if(!isTeacher) return res.status(404).json({ message: 'Invalid Teacher credentials' })

    
})

module.exports = { addUnit, assignUnit }