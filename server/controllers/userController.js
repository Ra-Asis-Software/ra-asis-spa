import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Student from "../models/Student.js";
import User from "../models/User.js";
import "../models/Assignment.js";
import "../models/Submission.js";
import Teacher from "../models/Teacher.js";
import Parent from "../models/Parent.js";

// @desc get student details
// @route   GET /api/users/student/:id
// @access  Private(Student, Admin)
export const getStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await Student.findOne({ bio: id })
    .populate({
      path: "bio",
      select: "-password -isVerified -loginAttempts",
    })
    .populate({
      path: "units",
      populate: {
        path: "assignments",
        populate: [
          {
            path: "unit",
            select: "unitCode unitName _id",
          },
          {
            path: "createdBy",
            select: "_id firstName lastName",
          },
        ],
      },
    })
    .populate("submissions");

  if (!student) {
    //get profile only if the specific user model has not been instantiated
    const userProfile = await User.findById(id).select(
      "-password -isVerified -loginAttempts"
    );

    if (!userProfile)
      return res.status(404).json({ message: "User details not found" });

    return res.status(200).json({
      message: "User profile retrieved",
      data: {
        profile: userProfile,
        units: [],
        assignments: [],
        submissions: [],
        events: [],
      },
    });
  }

  //return user details if the specific user model is found
  return res.status(200).json({
    message: "User details successfully retrieved",
    data: {
      profile: student.bio,
      units: student.units.map((unit) => {
        return { id: unit._id, name: unit.unitName, code: unit.unitCode };
      }),
      assignments: student.units.flatMap((unit) => unit.assignments),
      submissions: student.submissions,
      events: student.calendar,
    },
  });
});

// @desc    Get parent details
// @route   GET /api/users/parent/:id
// @access  Private (Parent)
export const getParent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const parent = await Parent.findOne({ bio: id })
      .populate({
        path: "bio",
        select: "-password -isVerified -loginAttempts",
      })
      .populate({
        path: "children",
        populate: {
          path: "bio",
          select: "firstName lastName email",
        },
      });

    if (!parent) {
      const userProfile = await User.findById(id).select(
        "-password -isVerified -loginAttempts"
      );
      if (!userProfile) {
        return res.status(404).json({ message: "User details not found" });
      }
      return res.status(200).json({
        message: "User profile retrieved",
        data: {
          profile: userProfile,
          children: [],
        },
      });
    }

    // Filter out any null children references
    const validChildren = parent.children.filter((child) => child && child.bio);

    res.status(200).json({
      message: "Parent details successfully retrieved",
      data: {
        profile: parent.bio,
        children: validChildren.map((child) => ({
          id: child.bio._id,
          firstName: child.bio.firstName,
          lastName: child.bio.lastName,
          email: child.bio.email,
        })),
      },
    });
  } catch (error) {
    console.error("Error in getParent:", error);
    res.status(500).json({ message: "Server error retrieving parent details" });
  }
});

// @desc    Link student to parent
// @route   PATCH /api/users/parent/:id/link-student
// @access  Private (Parent)
export const linkStudentToParent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { studentId } = req.body;

  // Validate studentId
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: "Invalid student ID format" });
  }

  try {
    // Verify student exists and is actually a student
    const studentUser = await User.findOne({
      _id: studentId,
      role: "student",
    });

    if (!studentUser) {
      return res.status(404).json({ message: "Student user not found" });
    }

    // Get or create the Student record
    let student = await Student.findOne({ bio: studentId });
    if (!student) {
      student = await Student.create({ bio: studentId });
    }

    // Update parent record
    const parent = await Parent.findOneAndUpdate(
      { bio: id },
      { $addToSet: { children: student._id } },
      { new: true, upsert: true }
    ).populate({
      path: "children",
      populate: {
        path: "bio",
        select: "firstName lastName email",
      },
    });

    // Format the response
    const responseData = {
      profile: parent.bio,
      children: parent.children
        .filter((child) => child && child.bio) // Filter out any null references
        .map((child) => ({
          id: child.bio._id,
          firstName: child.bio.firstName,
          lastName: child.bio.lastName,
          email: child.bio.email,
        })),
    };

    res.status(200).json({
      message: "Student linked successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Link student error:", error);
    res.status(500).json({
      message: "Error linking student to parent",
      error: error.message,
    });
  }
});

// @desc get teacher details
// @route   GET /api/users/teacher/:id
// @access  Private(Teacher, Admin)
export const getTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const teacher = await Teacher.findOne({ bio: id })
    .populate({
      path: "bio",
      select: "-password -isVerified -loginAttempts",
    })
    .populate({
      path: "units",
      populate: {
        path: "assignments",
        populate: [
          {
            path: "unit",
            select: "unitCode unitName _id",
          },
          {
            path: "createdBy",
            select: "_id firstName lastName",
          },
          {
            path: "submissionCount",
            select: "_id",
          },
          {
            path: "enrolledStudentsCount",
            select: "_id",
          },
        ],
      },
    });

  if (!teacher) {
    //get profile only if the specific user model has not been instantiated
    const userProfile = await User.findById(id).select(
      "-password -isVerified -loginAttempts"
    );

    if (!userProfile)
      return res.status(404).json({ message: "User details not found" });

    return res.status(200).json({
      message: "User profile retrieved",
      data: {
        profile: userProfile,
        units: [],
        assignments: [],
        events: [],
      },
    });
  }

  //return user details if the specific user model is found
  return res.status(200).json({
    message: "User details successfully retrieved",
    data: {
      profile: teacher.bio,
      units: teacher.units.map((unit) => {
        return { id: unit._id, name: unit.unitName, code: unit.unitCode };
      }),
      assignments: teacher.units.flatMap((unit) => unit.assignments),
      events: teacher.calendar,
    },
  });
});

// @desc    Get all students (for parent search)
// @route   GET /api/users/students
// @access  Private (Parent)
export const getAllStudents = asyncHandler(async (req, res) => {
  const { search } = req.query;

  try {
    let query = { role: "student" };

    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }

    const students = await User.find(query)
      .select("firstName lastName email _id")
      .limit(50);

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Error searching for students",
    });
  }
});

// @desc    Search student by email
// @route   GET /api/users/search-student?email=...
// @access  Private (Parent)
export const searchStudentByEmail = asyncHandler(async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email query parameter is required" });
  }

  try {
    // First find the user by email
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") }, // Exact match case insensitive
      role: "student",
    }).select("firstName lastName email _id");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Then get the student record if it exists
    const student = await Student.findOne({ bio: user._id })
      .select("units")
      .populate({
        path: "units",
        select: "unitName unitCode",
      });

    res.status(200).json({
      success: true,
      data: {
        profile: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        units: student?.units || [],
      },
    });
  } catch (error) {
    console.error("Search student error:", error);
    res.status(500).json({
      success: false,
      message: "Error searching for student",
    });
  }
});
