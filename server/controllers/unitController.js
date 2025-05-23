const asyncHandler = require('express-async-handler')
const Unit = require('../models/Unit')
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

module.exports = { addUnit }