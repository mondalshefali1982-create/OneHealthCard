import { Router } from 'express';
import { register, login, getProfile, changePassword, deleteAccount } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.post('/change-password', authMiddleware, changePassword);
router.delete('/delete-account', authMiddleware, deleteAccount);

export default router;
