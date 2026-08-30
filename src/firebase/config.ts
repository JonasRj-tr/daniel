import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, Firestore, getFirestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseAppletConfig from '../../firebase-applet-config.json';

// Build unified config allowing optional Vercel environment variable overrides
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId || 'voltaic-compiler-08gvj',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId || '1:555127034321:web:0e087ce9da7d7dcf2950f0',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey || 'AIzaSyBp_uhkYO2YvN-Mr0kv8wUvC-Pohd23lKg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain || 'voltaic-compiler-08gvj.firebaseapp.com',
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseAppletConfig.firestoreDatabaseId || 'ai-studio-315faed3-71c2-45db-880a-27af269826a1',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket || 'voltaic-compiler-08gvj.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId || '555127034321',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use getFirestore or initializeFirestore with experimentalAutoDetectLongPolling for smooth connectivity
let db: Firestore;
try {
  db = initializeFirestore(
    app,
    {
      experimentalForceLongPolling: true,
    },
    firebaseConfig.firestoreDatabaseId || '(default)'
  );
} catch {
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
}

const auth: Auth = getAuth(app);

export { app, db, auth, firebaseConfig };


