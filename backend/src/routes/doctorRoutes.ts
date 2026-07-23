import { Router } from 'express';
import { searchPatient, getPatientDetails, createPrescription, getDoctorProfile, updateDoctorProfile, listDoctors } from '../controllers/doctorController';
import { authenticate, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.get('/list', listDoctors);

router.use(authenticate);
router.use(requireRole('doctor'));

router.get('/search', searchPatient);
router.get('/patient/:patientId', getPatientDetails);
router.post('/prescription', createPrescription);
router.get('/profile', getDoctorProfile);
router.put('/profile', updateDoctorProfile);

export default router;
