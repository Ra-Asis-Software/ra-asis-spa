import asyncHandler from 'express-async-handler'
import Student from '../models/Student.js'
import User from '../models/User.js'
import '../models/Assignment.js'
import '../models/Submission.js'
import Teacher from '../models/Teacher.js'

//@desc get student details
// @route   GET /api/users/student/:id
// @access  Private(Student, Admin)
export const getStudent = asyncHandler( async(req, res) => {
    const { id } = req.params

    const student = await Student.findOne({ bio: id })
    .populate({
        path: 'bio',
        select: '-password -isVerified -loginAttempts'
    })
    .populate({
        path: 'units',
        populate: { path: 'assignments' }
    })
    .populate('submissions')

    if(!student) {
        //get profile only if the specific user model has not been instantiated
        const userProfile = await User.findById(id).select('-password -isVerified -loginAttempts')

        if(!userProfile) return res.status(404).json({ message: "User details not found" })
        
        return res.status(200).json({ 
            message: "User profile retrieved", 
            data : { 
                profile: userProfile, 
                units: [],
                assignments: [],
                events: []
            }})
    }

    //return user details if the specific user model is found
    return res.status(200).json({
        message: "User details successfully retrieved",
        data: {
            profile: student.bio,
            units: student.units.map(unit => {
                return { id: unit._id, name: unit.unitName, code: unit.unitCode }
            }),
            assignments: student.units.flatMap(unit => unit.assignments),
            submissions: student.submissions,
            events: student.calender,

        }
    })
})

//@desc get teacher details
// @route   GET /api/users/teacher/:id
// @access  Private(Teacher, Admin)
export const getTeacher = asyncHandler( async(req, res) => {
    const { id } = req.params

    const teacher = await Teacher.findOne({ bio: id })
    .populate({
        path: 'bio',
        select: '-password -isVerified -loginAttempts'
    })
    .populate({
        path: 'units',
        populate: { path: 'assignments' }
    })

    if(!teacher) {
        //get profile only if the specific user model has not been instantiated
        const userProfile = await User.findById(id).select('-password -isVerified -loginAttempts')

        if(!userProfile) return res.status(404).json({ message: "User details not found" })
        
        return res.status(200).json({ 
            message: "User profile retrieved", 
            data : { 
                profile: userProfile, 
                units: [],
                assignments: [],
                events: []
            }})
    }

    //return user details if the specific user model is found
    return res.status(200).json({
        message: "User details successfully retrieved",
        data: {
            profile: teacher.bio,
            units: teacher.units.map(unit => {
                return { id: unit._id, name: unit.unitName, code: unit.unitCode }
            }),
            assignments: teacher.units.flatMap(unit => unit.assignments),
            events: teacher.calender,

        }
    })
})