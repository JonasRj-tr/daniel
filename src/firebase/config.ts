import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, Firestore, getFirestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use getFirestore or initializeFirestore with experimentalAutoDetectLongPolling for smooth connectivity
let db: Firestore;
try {
  db = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true,
    },
    firebaseConfig.firestoreDatabaseId || '(default)'
  );
} catch {
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
}

const auth: Auth = getAuth(app);

export { app, db, auth, firebaseConfig };


