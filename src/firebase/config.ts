import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  Firestore 
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "voltaic-compiler-08gvj",
  appId: "1:555127034321:web:0e087ce9da7d7dcf2950f0",
  apiKey: "AIzaSyBp_uhkYO2YvN-Mr0kv8wUvC-Pohd23lKg",
  authDomain: "voltaic-compiler-08gvj.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-315faed3-71c2-45db-880a-27af269826a1",
  storageBucket: "voltaic-compiler-08gvj.firebasestorage.app",
  messagingSenderId: "555127034321"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let db: Firestore;
try {
  // Use persistent cache with multi-tab support for 100% offline-first capability
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  }, firebaseConfig.firestoreDatabaseId);
} catch {
  db = initializeFirestore(app, {}, firebaseConfig.firestoreDatabaseId);
}

const auth: Auth = getAuth(app);

export { app, db, auth };
