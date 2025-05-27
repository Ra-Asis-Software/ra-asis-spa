import asyncHandler from "express-async-handler";
import Unit from "../models/Unit.js";
import Teacher from '../models/Teacher.js'
import User from '../models/User.js'
import { validationResult, matchedData } from "express-validator";
import validator from "validator";

export const addUnit = asyncHandler(async (req, res) => {

  //check and return any errors caught during validation of the fields in the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

    //get sanitized data that has been validated from unitValidator
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

    //use email and role to identify the teacher
    const isTeacher = await User.findOne({ email, role: 'teacher' })

    if(!isTeacher) return res.status(404).json({ message: 'Invalid Teacher credentials' });

    //use the _id of the current User to update their Teacher document
    //add the unit to the units array if it doesn't exist in the teacher's document
    // upsert creates a new document if no document matches the criteria
    await Teacher.updateOne( { bio: isTeacher._id }, { $addToSet: { units: unitExists._id } }, { upsert: true } )

    return res.status(201).json({ message: "Unit has been successfully Assigned"})
})

export const deleteUnit = asyncHandler( async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { unitCode } = matchedData(req)

    
})