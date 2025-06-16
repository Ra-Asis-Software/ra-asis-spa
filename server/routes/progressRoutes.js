import { Router } from 'express';
import { getProgressData } from '../controllers/progressController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getProgressData);

export default router;