import { Router } from "express";
import { getStudent } from "../controllers/userController.js";
import { hasRole } from "../middleware/checkUserRole.js";

const router = Router()

//get student details
router.get(
    '/student/:id', 
    hasRole("administrator", "student"),
    getStudent)

export default router