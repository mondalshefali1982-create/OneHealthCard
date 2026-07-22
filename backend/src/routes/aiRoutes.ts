import { Router } from 'express';
import multer from 'multer';
import { uploadAndAnalyzeReport, getLabReports } from '../controllers/aiController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/analyze', authMiddleware, requireRole('patient'), upload.single('report'), uploadAndAnalyzeReport);
router.get('/reports', authMiddleware, requireRole('patient'), getLabReports);

export default router;
