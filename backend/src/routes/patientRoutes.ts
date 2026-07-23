import { Router } from 'express';
import { getDashboard, getProfile, updateProfile, getEmergencyContact, updateEmergencyContact, getPrescriptions } from '../controllers/patientController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);
router.use(requireRole('patient'));

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/emergency-contact', getEmergencyContact);
router.post('/emergency-contact', updateEmergencyContact);
router.put('/emergency-contact', updateEmergencyContact);
router.get('/prescriptions', getPrescriptions);

export default router;
