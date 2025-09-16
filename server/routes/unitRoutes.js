import { Router } from "express";
import {
  addUnit,
  approveUnitRequest,
  assignUnit,
  createUnitRequest,
  deleteUnit,
  enrollUnit,
  getAllUnits,
  getAssignmentSummaryByUnit,
  getStudents,
  getTeachers,
  getUnitRequests,
  getUnitsForUser,
  rejectUnitRequest,
  updateUnit,
} from "../controllers/unitController.js";
import {
  validateNewUnit,
  validateAssignUnit,
  validateUnitCode,
  validateUnitCodes,
  validateUpdateUnit,
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

// Route for enrolling for a unit (student)
router.patch("/enroll-unit", hasRole("student"), validateUnitCodes, enrollUnit);

router.put(
  "/update-unit/:id",
  hasRole("administrator"),
  validateUpdateUnit,
  updateUnit
);

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

// Route for getting assignment summary for a unit
router.get("/assignment-summary/:unitCode", getAssignmentSummaryByUnit);

// Route for getting units by user
router.get("/get-units-by-user", hasPermission("view:units"), getUnitsForUser);

// Route for getting all units
router.get("/get-all-units", getAllUnits);

// Route for getting all unit assignment requests
router.get("/requests", hasRole("administrator"), getUnitRequests);

// Route for a teacher to request to be assigned to a unit
router.post("/requests", hasRole("teacher"), createUnitRequest);

// Route for an admin to approve unit assignment requests (from teachers)
router.patch(
  "/requests/:requestId/approve",
  hasRole("administrator"),
  approveUnitRequest
);

// Route for an admin to reject unit assignment requests (from teachers)
router.patch(
  "/requests/:requestId/reject",
  hasRole("administrator"),
  rejectUnitRequest
);

export default router;
