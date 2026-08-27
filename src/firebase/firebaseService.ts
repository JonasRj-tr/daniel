import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  getDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth } from './config';
import { Property, SiteSettings } from '../types';
import { INITIAL_PROPERTIES } from '../data/initialProperties';
import { DEFAULT_SETTINGS } from '../data/initialSettings';

const PROPERTIES_COLLECTION = 'properties';
const SETTINGS_COLLECTION = 'settings';
const GENERAL_SETTINGS_DOC = 'general';

const LOCAL_STORAGE_PROPERTIES_KEY = 'dp_properties_cache_v4';
const LOCAL_STORAGE_SETTINGS_KEY = 'dp_settings_cache_v2';
const LOCAL_STORAGE_ADMIN_KEY = 'dp_admin_session';

// Helper to get cached properties
export function getLocalCachedProperties(): Property[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROPERTIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading local cached properties', e);
  }
  return INITIAL_PROPERTIES;
}

// Helper to get cached settings
export function getLocalCachedSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Error reading local cached settings', e);
  }
  return DEFAULT_SETTINGS;
}

// Subscribe to real-time properties updates
export function subscribeToProperties(
  callback: (properties: Property[]) => void,
  onError?: (error: Error) => void
) {
  const colRef = collection(db, PROPERTIES_COLLECTION);
  
  // Seed first if local is completely empty or online check needed
  seedInitialDataIfNeeded();

  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        // If collection is empty on remote, seed it
        seedDatabase();
        callback(getLocalCachedProperties());
      } else {
        const initialPricesMap = new Map(INITIAL_PROPERTIES.map((p) => [p.id, p]));
        const list: Property[] = [];
        snapshot.forEach((docSnapshot) => {
          const docData = docSnapshot.data() as Property;
          const initial = initialPricesMap.get(docSnapshot.id);
          let mergedPriceFormatted = docData.priceFormatted;
          let mergedPrice = docData.price;
          if (
            initial && 
            initial.priceFormatted && 
            initial.priceFormatted !== 'A Consultar' && 
            (!docData.priceFormatted || docData.priceFormatted === 'A Consultar')
          ) {
            mergedPriceFormatted = initial.priceFormatted;
            mergedPrice = initial.price;
          }
          list.push({ 
            id: docSnapshot.id, 
            ...docData,
            priceFormatted: mergedPriceFormatted || docData.priceFormatted,
            price: mergedPrice ?? docData.price
          } as Property);
        });
        
        // Sort featured first, then created desc
        list.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.createdAt || 0) - (a.createdAt || 0);
        });

        // Update local cache
        try {
          localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(list));
        } catch {
          // Ignore quota errors
        }

        callback(list);
      }
    },
    (err) => {
      console.warn('Firestore real-time properties error, using cached data:', err);
      callback(getLocalCachedProperties());
      if (onError) onError(err);
    }
  );

  return unsubscribe;
}

// Subscribe to real-time site settings
export function subscribeToSettings(
  callback: (settings: SiteSettings) => void
) {
  const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);

  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as SiteSettings;
        const merged = { ...DEFAULT_SETTINGS, ...data };
        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(merged));
        callback(merged);
      } else {
        // Save default settings to firestore
        setDoc(docRef, DEFAULT_SETTINGS, { merge: true }).catch(() => {});
        callback(DEFAULT_SETTINGS);
      }
    },
    (err) => {
      console.warn('Firestore settings error, using cached:', err);
      callback(getLocalCachedSettings());
    }
  );

  return unsubscribe;
}

// Save / update property
export async function saveProperty(property: Property): Promise<void> {
  const propId = property.id || `prop-${property.code || Date.now()}`;
  const dataToSave: Property = {
    ...property,
    id: propId,
    updatedAt: Date.now(),
    createdAt: property.createdAt || Date.now(),
  };

  // 1. Update local cache immediately for zero latency
  const current = getLocalCachedProperties();
  const existingIdx = current.findIndex((p) => p.id === propId);
  let updatedList: Property[];
  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = dataToSave;
  } else {
    updatedList = [dataToSave, ...current];
  }
  localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(updatedList));

  // 2. Sync to Firestore
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, propId);
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (err) {
    console.error('Error saving property to Firestore:', err);
  }
}

// Delete property
export async function removeProperty(id: string): Promise<void> {
  // Update local cache
  const current = getLocalCachedProperties().filter((p) => p.id !== id);
  localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(current));

  // Firestore sync
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting property in Firestore:', err);
  }
}

// Update site settings
export async function saveSettings(settings: Partial<SiteSettings>): Promise<void> {
  const current = getLocalCachedSettings();
  const merged: SiteSettings = { ...current, ...settings };
  localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(merged));

  try {
    const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
    await setDoc(docRef, merged, { merge: true });
  } catch (err) {
    console.error('Error saving settings to Firestore:', err);
  }
}

// Reset all properties to default 51 items
export async function resetPropertiesToDefault(): Promise<void> {
  localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(INITIAL_PROPERTIES));
  try {
    const batch = writeBatch(db);
    // Delete existing
    const existingSnap = await getDocs(collection(db, PROPERTIES_COLLECTION));
    existingSnap.forEach((d) => batch.delete(d.ref));
    
    // Add defaults
    for (const prop of INITIAL_PROPERTIES) {
      const docRef = doc(db, PROPERTIES_COLLECTION, prop.id);
      batch.set(docRef, prop);
    }
    await batch.commit();
  } catch (e) {
    console.warn('Batch reset in firestore failed, local updated', e);
  }
}

// Seed initial data if empty
async function seedInitialDataIfNeeded() {
  try {
    const settingsDoc = await getDoc(doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC));
    if (!settingsDoc.exists()) {
      await setDoc(doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC), DEFAULT_SETTINGS);
    }
  } catch {
    // offline or permissions
  }
}

async function seedDatabase() {
  try {
    const batch = writeBatch(db);
    for (const prop of INITIAL_PROPERTIES) {
      const docRef = doc(db, PROPERTIES_COLLECTION, prop.id);
      batch.set(docRef, prop);
    }
    await batch.commit();
  } catch (e) {
    console.warn('Seed database warning:', e);
  }
}

// Auth methods & Listener Registry
const authListeners = new Set<(isAdmin: boolean, user: FirebaseUser | null) => void>();

function notifyAuthListeners(user: FirebaseUser | null = auth.currentUser) {
  const isAdmin = !!user || localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY) === 'true';
  authListeners.forEach((cb) => {
    try {
      cb(isAdmin, user);
    } catch (e) {
      console.warn('Error in auth listener callback:', e);
    }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dp_admin_auth_changed', { detail: { isAdmin } }));
  }
}

export function getIsAdminCached(): boolean {
  try {
    return localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY) === 'true' || !!auth.currentUser;
  } catch {
    return false;
  }
}

export async function loginAdmin(email: string, pass: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  const isDefaultAdmin = (
    cleanEmail === 'daniel.pacheco@creci.org.br' || 
    cleanEmail === 'daniel@x.com' || 
    cleanEmail === 'admin@danielpacheco.com.br' || 
    cleanEmail === 'daniel'
  ) && (pass === 'daniel4321' || pass === 'admin' || pass === '123456');

  // If standard admin credentials match, grant immediate access
  if (isDefaultAdmin) {
    localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, 'true');
    notifyAuthListeners(auth.currentUser);
    
    // Also try Firebase sign in or user creation silently in background
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, pass);
    } catch {
      try {
        await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      } catch {
        // Safe to ignore if offline or unconfigured
      }
    }
    notifyAuthListeners(auth.currentUser);
    return true;
  }

  // Otherwise, try Firebase Auth
  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, 'true');
    notifyAuthListeners(cred.user);
    return true;
  } catch (err: unknown) {
    const errorCode = (err as { code?: string })?.code;
    
    // If user typed default password
    if (pass === 'daniel4321' || pass === 'admin') {
      localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, 'true');
      notifyAuthListeners(null);
      return true;
    }
    
    throw new Error(errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential' 
      ? 'Senha incorreta ou e-mail inválido. Credenciais padrão: daniel.pacheco@creci.org.br / daniel4321' 
      : 'Credenciais inválidas. Utilize e-mail daniel.pacheco@creci.org.br e senha daniel4321.');
  }
}

export async function logoutAdmin(): Promise<void> {
  localStorage.removeItem(LOCAL_STORAGE_ADMIN_KEY);
  try {
    await signOut(auth);
  } catch {
    // Ignore
  }
  notifyAuthListeners(null);
}

export function subscribeToAuth(callback: (isAdmin: boolean, user: FirebaseUser | null) => void) {
  authListeners.add(callback);
  
  const localIsAdmin = getIsAdminCached();
  callback(localIsAdmin, auth.currentUser);

  const unsub = onAuthStateChanged(auth, (user) => {
    const isAdmin = !!user || localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY) === 'true';
    callback(isAdmin, user);
  });

  return () => {
    authListeners.delete(callback);
    unsub();
  };
}

export const subscribeProperties = subscribeToProperties;
export const subscribeSettings = subscribeToSettings;
export const subscribeAdminState = (callback: (isAdmin: boolean) => void) => {
  return subscribeToAuth((isAdmin) => callback(isAdmin));
};
export const initFirebaseData = seedInitialDataIfNeeded;
