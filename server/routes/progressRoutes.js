import { Router } from 'express';
import { getProgressData } from '../controllers/progressController.js';
import { hasRole } from '../middleware/checkUserRole.js';

const router = Router();

// router.get('/', authenticate, getProgressData);
router.get('/', hasRole('student', 'teacher'), getProgressData);
router.get("/weekly", hasRole("student", "teacher", "administrator"), getProgressData);

export default router;