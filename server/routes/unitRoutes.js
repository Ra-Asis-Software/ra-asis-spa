import { Router } from "express";
import { addUnit } from "../controllers/unitController.js";
import { validateNewUnit } from "../validators/unitValidator.js";
import { hasPermission } from "../middleware/checkUserRole.js";

const router = Router();

router.post(
  "/add-unit",
  hasPermission("create:unit"),
  validateNewUnit,
  addUnit
);

export default router;
