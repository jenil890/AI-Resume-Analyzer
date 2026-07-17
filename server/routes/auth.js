import express from 'express';
import { register, getProfile, updateProfile } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Register acts as a sync endpoint after Firebase account creation, thus requires authMiddleware
router.post('/register', authMiddleware, register);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

export default router;
