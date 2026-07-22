import { Router } from 'express';
import { getPatientDashboard, updatePatientProfile, getMedicalTimeline } from '../controllers/patientController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/dashboard', authMiddleware, requireRole('patient'), getPatientDashboard);
router.put('/profile', authMiddleware, requireRole('patient'), updatePatientProfile);
router.get('/timeline', authMiddleware, requireRole('patient'), getMedicalTimeline);

export default router;
