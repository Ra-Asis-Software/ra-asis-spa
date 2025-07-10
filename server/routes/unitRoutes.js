import { Router } from "express";
import {
  addUnit,
  assignUnit,
  deleteUnit,
  enrollUnit,
  getAllUnits,
  getStudents,
  getTeachers,
} from "../controllers/unitController.js";
import {
  validateNewUnit,
  validateAssignUnit,
  validateUnitCode,
} from "../validators/unitValidator.js";
import { hasPermission, hasRole } from "../middleware/checkUserRole.js";

const router = Router();

// Route for creating a new unit
router.post(
  "/add-unit",
  hasPermission("create:unit"),
  validateNewUnit,
  addUnit
);

// Route for assigning a unit to a teacher
router.patch(
  "/assign-unit",
  hasPermission("assign:unit"),
  validateAssignUnit,
  assignUnit
);

//Route for enrolling for a unit (student)
router.patch("/enroll-unit", hasRole("student"), validateUnitCode, enrollUnit);

// Route for deleting a unit
router.delete(
  "/delete-unit",
  hasPermission("delete:unit"),
  validateUnitCode,
  deleteUnit
);

// Route for retrieving students by unit
router.get(
  "/get-students-by-unit",
  hasRole("administrator", "teacher", "student"),
  validateUnitCode,
  getStudents
);

// Route for retrieving teachers by unit
router.get(
  "/get-teachers-by-unit",
  hasRole("administrator", "teacher", "student"),
  validateUnitCode,
  getTeachers
);

// Route for getting all units
router.get("/get-all-units", getAllUnits);

export default router;
