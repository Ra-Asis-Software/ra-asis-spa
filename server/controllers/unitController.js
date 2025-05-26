import asyncHandler from "express-async-handler";
import Unit from "../models/Unit.js";
import { validationResult, matchedData } from "express-validator";
import validator from "validator";

export const addUnit = asyncHandler(async (req, res) => {

  //check and return any errors caught during validation of the fields in the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

    //get the data that has been validated from unitValidator
    const { unitCode, unitName } = matchedData(req)

    //check if unit exists, regardless of case
    const unitExists = await Unit.findOne({ unitCode: { $regex: `^${unitCode}$`, $options: 'i' } })

    if(unitExists) {
        return res.status(409).json({ message: `Unit Code ${unitCode} already Exists`, conflict: 'unitCode' })
    }

    await Unit.create({ unitCode, unitName })

    return res.status(201).json({ message: `Unit successfully created` })
})

export const assignUnit = asyncHandler( async (req, res) => {

  //errors caught during validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //get validated data from unitValidator
    const { email, unitCode } = matchedData(req)

    const unitExists = await Unit.findOne({ unitCode: { $regex: `^${unitCode}$`, $options: 'i' } })

    if(!unitExists) return res.status(404).json({ message: 'The requested unit could not be found' });

    const isTeacher = await Teacher.findOne({ email })

    if(!isTeacher) return res.status(404).json({ message: 'Invalid Teacher credentials' });

    
})