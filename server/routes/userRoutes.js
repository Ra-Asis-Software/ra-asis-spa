import { Router } from "express";
import {
  getAllStudents,
  getParent,
  getStudent,
  getTeacher,
  linkStudentToParent,
  searchStudentByEmail,
} from "../controllers/userController.js";
import { hasRole } from "../middleware/checkUserRole.js";

const router = Router();

// get student details
router.get(
  "/student/:id",
  hasRole("administrator", "parent", "student"),
  getStudent
);

// get teacher details
router.get("/teacher/:id", hasRole("administrator", "teacher"), getTeacher);

// get parent details
router.get("/parent/:id", hasRole("parent"), getParent);

// add student to parent's children
router.patch(
  "/parent/:id/link-student",
  hasRole("parent"),
  linkStudentToParent
);

// get all students
router.get("/students", hasRole("parent"), getAllStudents);

// get search results
router.get(
  "/search-student",
  hasRole("administrator", "parent"),
  searchStudentByEmail
);

export default router;
