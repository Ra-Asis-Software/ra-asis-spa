import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import sendMail from "../utils/sendMail.js";
import { deleteFile } from "../utils/deleteFile.js";
import User from "../models/User.js";
import Unit from "../models/Unit.js";
import Assignment from "../models/Assignment.js";
import Quiz from "../models/Quiz.js";
import Submission from "../models/Submission.js";
import QuizSubmission from "../models/QuizSubmission.js";
import Parent from "../models/Parent.js";
import Testimonial from "../models/Testimonial.js";

// @desc    Create a new user
// @route   POST /api/admin
// @access  Private (Admin)
export const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, phoneNumber, email, username, password, role } =
    req.body;

  if (req.user.role !== "administrator") {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  if (role === "administrator") {
    return res.status(400).json({ message: "Cannot create admin accounts" });
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }, { phoneNumber }],
  });

  if (existingUser) {
    return res.status(400).json({
      message: "User with these details already exists",
    });
  }

  const user = await User.create({
    firstName,
    lastName,
    phoneNumber,
    email,
    username,
    password,
    role,
    createdBy: req.user._id,
    isVerified: true,
  });

  const token = generateToken({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    role: user.role,
  });

  const message = `
    <p>Hello ${firstName},</p>
    <p>Your Ra'Asis SPA ${role} account has been created by an administrator.</p>
    <p>You can login using:</p>
    <p>Email: ${email}</p>
    <p>Password: ${password}</p>
    <p>Ensure to change your password after logging in. Don't share your credentials!</p>
    <br />
    <br />
    <p><strong>Regards,<br />The Ra'Asis SPA Team.</strong></p>
  `;

  try {
    await sendMail({
      email: user.email,
      subject: "Your New Ra'Asis SPA Account",
      message,
    });
  } catch (emailError) {
    console.error("Failed to send new account email:", emailError);
  }

  res.status(201).json({
    _id: user._id,
    firstName: user.firstName,
    email: user.email,
    role: user.role,
    token,
  });
});

// @desc    Get list of users
// @route   POST /api/admin
// @access  Private (Admin)
export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role } = req.query;
  const filter = {};

  if (role) filter.role = role;
  if (req.user.role !== "administrator") {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const users = await User.find(filter)
    .select("-password -loginAttempts -lockUntil")
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("createdBy", "firstName lastName email");

  const count = await User.countDocuments(filter);

  res.status(200).json({
    users,
    count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});

// @desc    Update user details
// @route   PUT /api/admin/updateuser/:id
// @access  Private (Admin)
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (req.user.role !== "administrator") {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Prevent modifying admin accounts
  if (user.role === "administrator") {
    return res.status(400).json({ message: "Cannot modify admin accounts" });
  }

  // Prevent changing email/username if it conflicts with existing users
  if (updates.email || updates.username) {
    const orConditions = [];

    if (updates.email) {
      orConditions.push({ email: updates.email });
    }
    if (updates.username) {
      orConditions.push({ username: updates.username });
    }

    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: id } }, // Exclude current user
        { $or: orConditions },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with these details already exists",
      });
    }
  }

  // Update allowed fields
  const allowedUpdates = [
    "firstName",
    "lastName",
    "email",
    "username",
    "phoneNumber",
    "role",
    "password",
  ];
  allowedUpdates.forEach((field) => {
    if (updates[field] !== undefined) {
      user[field] = updates[field];
    }
  });

  await user.save();

  const message = `
    <p><strong>Hello ${user.firstName},</strong></p>
    <p>Your Ra'Asis SPA account has been modified by an administrator.</p>
    <p>Contact <a href="mailto:support@raasissoftware.com">support</a> to know what has changed to avoid service disruptions. Ensure you can access your account by signing out then signing in again.</p>
    <br />
    <br />
    <p><strong>Regards,<br />The Ra'Asis SPA Team.</strong></p>
  `;

  try {
    await sendMail({
      email: user.email,
      subject: "Your Ra'Asis SPA Account Has Been Modified",
      message,
    });
  } catch (emailError) {
    console.error("Failed to send account update email:", emailError);
  }

  res.status(200).json({
    message: "User updated successfully",
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
});

// @desc    Toggle user activation status
// @route   PATCH /api/admin/toggle-activation/:id
// @access  Private (Admin)
export const toggleUserActivation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'activate' or 'deactivate'

  if (req.user.role !== "administrator") {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role === "administrator") {
    return res.status(400).json({ message: "Cannot modify admin accounts" });
  }

  // Determine new user status and prepare email
  const newStatus = action === "activate";
  user.isActive = newStatus;
  await user.save();

  // Send appropriate email notification
  const emailSubject = newStatus
    ? "Your Ra'Asis SPA Account Is Back Active"
    : "Your Ra'Asis SPA Account Has Been Deactivated";

  const emailMessage = newStatus
    ? `
      <p><strong>Hello ${user.firstName},</strong></p>
      <p>Your Ra'Asis SPA account has been reactivated by an administrator.</p>
      <p>You can now log in and access all features as before.</p>
      <p>If you have any questions, please contact <a href="mailto:support@raasissoftware.com">support</a>.</p>
      <br />
      <br />
      <p><strong>Regards,<br />The Ra'Asis SPA Team.</strong></p>
    `
    : `
      <p><strong>Hello ${user.firstName},</strong></p>
      <p>Your Ra'Asis SPA account has been deactivated by an administrator.</p>
      <p>You will no longer be able to access your account until it is reactivated.</p>
      <p>If you believe this was done in error, please contact <a href="mailto:support@raasissoftware.com">support</a> immediately.</p>
      <br />
      <br />
      <p><strong>Regards,<br />The Ra'Asis SPA Team.</strong></p>
    `;

  try {
    await sendMail({
      email: user.email,
      subject: emailSubject,
      message: emailMessage,
    });
  } catch (emailError) {
    console.error(`Failed to send ${action} email:", emailError`);
  }

  res.status(200).json({
    message: `User ${user.email} ${action}d successfully`,
    isActive: user.isActive,
  });
});

// @desc    Delete a user permanently
// @route   DELETE /api/admin/deleteuser/:id
// @access  Private (Admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== "administrator") {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role === "administrator") {
    return res.status(400).json({ message: "Cannot delete admin accounts" });
  }

  // Get all documents that might have files before deleting
  const submissions = await Submission.find({ student: id });
  const quizSubmissions = await QuizSubmission.find({ student: id });

  // Delete all documents associated with this user
  await Promise.all([
    // Update units where this user is referenced as teachers
    Unit.updateMany({ teachers: id }, { $pull: { teachers: id } }),

    // Update parents where this user is referenced as children
    Parent.updateMany({ children: id }, { $pull: { children: id } }),

    // Update assignments where this user is referenced as createdBy
    Assignment.updateMany({ createdBy: id }, { $unset: { createdBy: 1 } }),

    // Update quizzes where this user is referenced as createdBy
    Quiz.updateMany({ createdBy: id }, { $unset: { createdBy: 1 } }),

    // Delete assignment submissions by the user
    Submission.deleteMany({ student: id }),

    // Delete quiz submissions by the user
    QuizSubmission.deleteMany({ student: id }),

    // Delete User testimonial
    Testimonial.deleteOne({ user: id }),

    // Finally delete the user
    User.deleteOne({ _id: id }),
  ]);

  // Delete all associated files
  try {
    // Delete all submission files
    submissions.forEach((submission) => {
      if (submission.files?.filePath) {
        deleteFile(submission.files.filePath);
      }
    });

    // Delete all quiz submission files
    quizSubmissions.forEach((submission) => {
      if (submission.files?.filePath) {
        deleteFile(submission.files.filePath);
      }
    });
  } catch (fileError) {
    console.error("Error deleting files:", fileError);
  }

  const message = `
      <p style="color:#027a79;"><strong>Hello ${user.firstName},</strong></p>
      <p>Your Ra'Asis SPA account has been permanently deleted by an administrator.</p>
      <p>All associated data including your submissions, assignment files and references have been removed from our system.</p>
      <p>If you believe this was done in error, please contact <a href="mailto:support@raasissoftware.com">support</a> immediately.</p>
      <br />
      <br />
      <p><strong>Regards,<br />The Ra'Asis SPA Team.</strong></p>
    `;

  try {
    await sendMail({
      email: user.email,
      subject: "Your Ra'Asis SPA Account Deletion",
      message,
    });
  } catch (emailError) {
    console.error("Failed to send deletion email:", emailError);
  }

  res.status(200).json({
    message: `User ${user.email} and all associated data deleted permanently`,
  });
});
