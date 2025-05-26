import { Router } from "express";
import { addUnit, assignUnit } from "../controllers/unitController.js";
import { validateNewUnit, validateAssignUnit } from "../validators/unitValidator.js";
import { hasPermission } from "../middleware/checkUserRole.js";

const router = Router();

router.post('/add-unit', hasPermission("create:unit"), validateNewUnit, addUnit)
router.post('/assign-unit', hasPermission("assign:unit"), validateAssignUnit, assignUnit)

export default router