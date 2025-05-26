const asyncHandler = require('express-async-handler')
const Unit = require('../models/Unit')
const { validationResult } = require('express-validator')
const validator = require('validator')

const addUnit = asyncHandler(async (req, res) => {

  //check and return any errors caught during validation of the fields in the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { unitCode, unitName } = req.body

    //normalize unit code and convert to lowercase to ensure case insensitivity when comparing with database value
    const normalizedUnitCode = unitCode.trim().toLowerCase()

    //sanitize unit name to prevent script injection and remove any whitespaces
    const sanitizedUnitName = validator.escape(unitName.trim())

    //check if unit exists, regardless of case
    const unitExists = await Unit.findOne({ unitCode: { $regex: `^${normalizedUnitCode}$`, $options: 'i' } })

    if(unitExists) {
        return res.status(409).json({ message: `Unit Code ${unitCode} already Exists`, conflict: 'unitCode' })
    }

    await Unit.create({ unitCode, unitName: sanitizedUnitName })

    return res.status(201).json({ message: `Unit successfully created` })
})

module.exports = { addUnit }