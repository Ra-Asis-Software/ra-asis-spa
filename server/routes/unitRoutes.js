import { Router } from "express";
import { addUnit, assignUnit, deleteUnit } from "../controllers/unitController.js";
import { validateNewUnit, validateAssignUnit, validateDeleteUnit } from "../validators/unitValidator.js";
import { hasPermission } from "../middleware/checkUserRole.js";

const router = Router();

router.post('/add-unit', hasPermission("create:unit"), validateNewUnit, addUnit)
router.post('/assign-unit', hasPermission("assign:unit"), validateAssignUnit, assignUnit)
router.post('/delete-unit', validateDeleteUnit, deleteUnit)

export default router