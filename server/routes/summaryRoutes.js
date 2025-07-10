import { Router } from 'express';
import { getAssignmentSummaryByUnit } from '../controllers/summaryController.js';

const router = Router();

router.get("/assignment-summary/:unitCode", getAssignmentSummaryByUnit);

export default router;