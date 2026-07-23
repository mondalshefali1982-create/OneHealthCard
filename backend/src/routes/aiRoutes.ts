import { Router } from 'express';
import { analyzeReport } from '../controllers/aiController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.post('/analyze-report', authenticate, requireRole('patient'), analyzeReport);

export default router;
