import express from 'express';
import { uploadAndAnalyze, getHistory, getAnalysisById, deleteAnalysis } from '../controllers/resumeController.js';
import authMiddleware from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Upload and analyze resume
router.post('/upload', authMiddleware, upload.single('resume'), uploadAndAnalyze);

// Fetch previous analyses history
router.get('/history', authMiddleware, getHistory);

// Fetch a single analysis detail
router.get('/history/:id', authMiddleware, getAnalysisById);

// Delete analysis by ID
router.delete('/history/:id', authMiddleware, deleteAnalysis);

export default router;
