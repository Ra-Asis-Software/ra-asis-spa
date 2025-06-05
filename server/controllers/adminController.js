import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import sendMail from "../utils/sendMail.js";

// @desc    Create a new user
// @route   POST /api/admin/adduser
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
  `;

  await sendMail({
    email: user.email,
    subject: "Your New Ra'Asis SPA Account",
    message,
  });

  res.status(201).json({
    _id: user._id,
    firstName: user.firstName,
    email: user.email,
    role: user.role,
    token,
  });
});

// @desc    Get list of users
// @route   POST /api/admin/getusers
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
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});

// @desc    Deactivate a user
// @route   POST /api/admin/deactivateuser
// @access  Private (Admin)
export const deactivateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== "administrator") {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role === "administrator") {
    return res
      .status(400)
      .json({ message: "Cannot deactivate admin accounts" });
  }

  user.isActive = false;
  await user.save();

  res.status(200).json({
    message: `User ${user.email} deactivated successfully`,
  });
});

// @desc    Delete a user permanently
// @route   DELETE /api/admin/deleteuser
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

  await User.deleteOne({ _id: id });

  const message = `
      <p>Hello ${user.firstName},</p>
      <p>Your Ra'Asis SPA account has been permanently deleted by an administrator.</p>
      <p>If you believe this was done in error, please contact support immediately.</p>
    `;

  await sendMail({
    email: user.email,
    subject: "Your Ra'Asis SPA Account Deletion",
    message,
  });

  res.status(200).json({
    message: `User ${user.email} deleted permanently`,
  });
});
