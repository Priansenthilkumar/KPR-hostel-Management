// src/services/firebaseConfig.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// KPRIET Hostel & Mess Management Suite - Firebase Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB_KPRIET_HOSTEL_MESS_APP_KEY_2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kpr-hostel-management.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kpr-hostel-management",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kpr-hostel-management.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "998822334411",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:998822334411:web:a1b2c3d4e5f6g7h8i9j0"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
