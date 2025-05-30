import AsyncHandler from 'express-async-handler'
import Student from '../models/Student.js'
import User from '../models/User.js'

//@desc get student details
// @route   GET /api/users/student/:id
// @access  Private(Student, Admin)
export const getStudent = AsyncHandler( async(req, res) => {
    const { id } = req.params

    const student = await Student.findOne({ bio: id })

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
        data: student
    })
})