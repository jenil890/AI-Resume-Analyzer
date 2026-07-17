import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase credentials layout with local development fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAnDlX8dYiu5QqxJaJL2GSNW285c4vZH5w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-projects-54eae.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-projects-54eae",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-projects-54eae.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "217111487217",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:217111487217:web:363fee6daff0fe7252ff50"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase Auth
export const auth = getAuth(app);
export default app;
