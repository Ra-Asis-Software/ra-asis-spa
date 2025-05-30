import { Router } from "express";
import { addUnit, assignUnit, deleteUnit, getAllUnits, getStudents, getTeachers } from "../controllers/unitController.js";
import { validateNewUnit, validateAssignUnit, validateUnitCode } from "../validators/unitValidator.js";
import { hasPermission, hasRole } from "../middleware/checkUserRole.js";

const router = Router();

router.post('/add-unit', hasPermission("create:unit"), validateNewUnit, addUnit)
router.post('/assign-unit', hasPermission("assign:unit"), validateAssignUnit, assignUnit)
router.post('/delete-unit', hasPermission("delete:unit"), validateUnitCode, deleteUnit)
router.post('/get-students-by-unit', hasRole("administrator", "teacher", "student"), validateUnitCode, getStudents)
router.post('/get-teachers-by-unit', hasRole("administrator", "teacher", "student"), validateUnitCode, getTeachers)
router.get('/get-all-units', getAllUnits)

export default router