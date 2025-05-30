import { Router } from "express";
import { getStudent, getTeacher } from "../controllers/userController.js";
import { hasRole } from "../middleware/checkUserRole.js";

const router = Router()

//get student details
router.get(
    '/student/:id', 
    hasRole("administrator", "student"),
    getStudent
)

//get teacher details
router.get(
    '/teacher/:id',
    hasRole("administrator", "teacher"),
    getTeacher
)

export default router