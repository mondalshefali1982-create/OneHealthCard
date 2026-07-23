import { Router } from 'express';
import { getPatientDashboard, updatePatientProfile, getMedicalTimeline, getPatientPrescriptions } from '../controllers/patientController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/dashboard', authMiddleware, requireRole('patient'), getPatientDashboard);
router.get('/prescriptions', authMiddleware, requireRole('patient'), getPatientPrescriptions);
router.put('/profile', authMiddleware, requireRole('patient'), updatePatientProfile);
router.get('/timeline', authMiddleware, requireRole('patient'), getMedicalTimeline);

export default router;
