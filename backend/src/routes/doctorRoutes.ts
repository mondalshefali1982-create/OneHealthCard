import { Router } from 'express';
import { searchPatient, addPrescription, addMedicalRecord, searchDoctors } from '../controllers/doctorController.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

// Open route for searching the doctor directory
router.get('/directory', searchDoctors);

// Protected routes requiring doctor credentials
router.get('/patient/:healthId', authMiddleware, requireRole('doctor'), searchPatient);
router.post('/patient/:healthId/prescription', authMiddleware, requireRole('doctor'), addPrescription);
router.post('/patient/:healthId/record', authMiddleware, requireRole('doctor'), addMedicalRecord);

export default router;
