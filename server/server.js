import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { readFileSync } from 'fs';
import path from 'path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';

dotenv.config();

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  try {
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } else {
      const serviceAccountPath = path.resolve('config/firebase-service-account.json');
      serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    }
    initializeApp({
      credential: cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.warn('----------------------------------------------------');
    console.warn('WARNING: Firebase Admin SDK failed to initialize with JSON.');
    console.warn('Please download your service account key from Firebase Console');
    console.warn('and save it to: server/config/firebase-service-account.json');
    console.warn('Or set the FIREBASE_SERVICE_ACCOUNT_JSON environment variable.');
    console.warn('Error Details:', error.message);
    console.warn('----------------------------------------------------');
    
    // Fallback for local development
    initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'ai-projects-54eae',
    });
  }
}

export const db = getFirestore();

const app = express();

// Express Application middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'AI Resume Analyzer Server is running.' });
});

// Global Error Handler (e.g., Multer/file constraints)
app.use((err, req, res, next) => {
  if (err.message && (err.message.includes('file size') || err.message.includes('file type') || err.message.includes('Invalid file type'))) {
    return res.status(400).json({ message: err.message });
  }
  console.error('Server error:', err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
