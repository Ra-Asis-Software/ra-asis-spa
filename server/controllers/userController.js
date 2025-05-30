import AsyncHandler from 'express-async-handler'
import Student from '../models/Student.js'
import User from '../models/User.js'
import '../models/Assignment.js'
import '../models/Submission.js'

//@desc get student details
// @route   GET /api/users/student/:id
// @access  Private(Student, Admin)
export const getStudent = AsyncHandler( async(req, res) => {
    const { id } = req.params

    const student = await Student.findOne({ bio: id })
    .populate('bio')
    .populate({
        path: 'units',
        populate: { path: 'assignments' }
    })
    .populate('submissions')

    if(!student) {
        //get profile only if the specific user model has not been instantiated
        const userProfile = await User.findById(id)

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