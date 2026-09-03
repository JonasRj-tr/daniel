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
import { Property, SiteSettings, LandingPage } from '../types';
import { INITIAL_PROPERTIES } from '../data/initialProperties';
import { DEFAULT_SETTINGS } from '../data/initialSettings';

const PROPERTIES_COLLECTION = 'properties';
const SETTINGS_COLLECTION = 'settings';
const LANDING_PAGES_COLLECTION = 'landing_pages';
const PROPERTY_PHOTOS_COLLECTION = 'property_photos';
const GENERAL_SETTINGS_DOC = 'general';

const LOCAL_STORAGE_PROPERTIES_KEY = 'dp_properties_cache_v6';
const LOCAL_STORAGE_SETTINGS_KEY = 'dp_settings_cache_v3';
const LOCAL_STORAGE_LANDING_PAGES_KEY = 'dp_landing_pages_cache_v1';
const LOCAL_STORAGE_ADMIN_KEY = 'dp_admin_session';

/**
 * Deep sanitization for Firestore:
 * Firestore throws a fatal error if ANY field is undefined (e.g. suites: undefined).
 * This recursively removes any undefined keys or converts them so Firestore accepts the document cleanly.
 */
export function cleanFirestoreData<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as any;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => cleanFirestoreData(item)) as any;
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanFirestoreData(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

// In-memory cache for resolved property photos
const photoCache = new Map<string, string>();

/**
 * Resolves any firestore_photo:// references back to full WebP data URLs.
 */
export async function resolvePropertiesPhotos(properties: Property[]): Promise<Property[]> {
  const unresolvedRefs: string[] = [];
  properties.forEach((p) => {
    (p.images || []).forEach((img) => {
      if (img && img.startsWith('firestore_photo://') && !photoCache.has(img)) {
        unresolvedRefs.push(img);
      }
    });
  });

  if (unresolvedRefs.length > 0) {
    await Promise.all(
      unresolvedRefs.map(async (refUrl) => {
        const photoId = refUrl.replace('firestore_photo://', '');
        try {
          const snap = await getDoc(doc(db, PROPERTY_PHOTOS_COLLECTION, photoId));
          if (snap.exists() && snap.data()?.dataUrl) {
            photoCache.set(refUrl, snap.data().dataUrl);
          }
        } catch {
          // ignore network hiccups
        }
      })
    );
  }

  return properties.map((p) => ({
    ...p,
    images: (p.images || []).map((img) => (img && photoCache.has(img) ? photoCache.get(img)! : img)),
  }));
}

/**
 * Processes property images before saving:
 * - Up to 800KB total kept directly in property document for instant rendering across all components.
 * - If gallery is extraordinarily large, splits across property_photos to guarantee Firestore document limit (1MB).
 */
async function processPropertyImages(propertyId: string, images: string[]): Promise<string[]> {
  if (!images || images.length === 0) return [];
  const processed: string[] = [];
  let totalDataLength = 0;

  for (const img of images) {
    if (img && img.startsWith('data:image')) {
      totalDataLength += img.length;
    }
  }

  // Firestore hard limit is 1MB (1,048,576 bytes). We keep up to 800KB directly in document
  const canFitInDoc = totalDataLength < 800 * 1024;

  for (let idx = 0; idx < images.length; idx++) {
    const img = images[idx];
    if (!img) continue;

    if (img.startsWith('http://') || img.startsWith('https://')) {
      processed.push(img);
      continue;
    }

    if (img.startsWith('firestore_photo://')) {
      if (canFitInDoc && photoCache.has(img)) {
        processed.push(photoCache.get(img)!);
      } else {
        processed.push(img);
      }
      continue;
    }

    if (img.startsWith('data:image')) {
      if (canFitInDoc) {
        processed.push(img);
      } else {
        const photoId = `${propertyId}_img_${idx}`;
        const refUrl = `firestore_photo://${photoId}`;
        const photoRef = doc(db, PROPERTY_PHOTOS_COLLECTION, photoId);
        await setDoc(photoRef, {
          id: photoId,
          propertyId,
          index: idx,
          dataUrl: img,
          updatedAt: Date.now(),
        }, { merge: true });

        photoCache.set(refUrl, img);
        processed.push(refUrl);
      }
    } else {
      processed.push(img);
    }
  }

  return processed;
}

// Helper to get cached properties
export function getLocalCachedProperties(): Property[] {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_STORAGE_PROPERTIES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
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
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
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
  
  // Seed first if remote is completely empty
  seedInitialDataIfNeeded();

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // If collection is empty on remote, seed it
        await seedDatabase();
        callback(getLocalCachedProperties());
      } else {
        const list: Property[] = [];
        snapshot.forEach((docSnapshot) => {
          const docData = docSnapshot.data() as Property;
          list.push({ 
            id: docSnapshot.id, 
            ...docData
          } as Property);
        });
        
        // Sort featured first, then created desc
        list.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.createdAt || 0) - (a.createdAt || 0);
        });

        // Resolve any firestore_photo references
        const resolvedList = await resolvePropertiesPhotos(list);

        // Update local cache
        try {
          localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(resolvedList));
        } catch {
          // Ignore quota errors
        }

        callback(resolvedList);
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
        setDoc(docRef, cleanFirestoreData(DEFAULT_SETTINGS), { merge: true }).catch(() => {});
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

// Save / update property with guaranteed Firestore persistence
export async function saveProperty(property: Property): Promise<Property> {
  const propId = property.id || `prop-${property.code || Date.now()}`;
  
  // Clean invalid / empty values from images
  const cleanImages = (property.images || []).filter((img) => typeof img === 'string' && img.trim().length > 0);

  // 1. Process images (safely storing up to 800KB directly in doc for instant rendering)
  const processedImages = await processPropertyImages(propId, cleanImages);

  const rawData: Property = {
    ...property,
    id: propId,
    images: processedImages,
    updatedAt: Date.now(),
    createdAt: property.createdAt || Date.now(),
  };

  // 2. Sanitize to prevent undefined field crashes in Firestore
  const dataToSave = cleanFirestoreData(rawData);

  // 3. Write to Firestore Cloud FIRST
  const docRef = doc(db, PROPERTIES_COLLECTION, propId);
  await setDoc(docRef, dataToSave, { merge: true });

  // 4. Update local cache with resolved photos for instant feedback
  const resolvedList = await resolvePropertiesPhotos([dataToSave]);
  const finalLocalItem = resolvedList[0] || dataToSave;

  const current = getLocalCachedProperties();
  const existingIdx = current.findIndex((p) => p.id === propId);
  let updatedList: Property[];
  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = finalLocalItem;
  } else {
    updatedList = [finalLocalItem, ...current];
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(updatedList));
  } catch {
    // Quota fallback: keep lightweight version (only cover image per property) in localStorage
    try {
      const lightweight = updatedList.map((p) => ({
        ...p,
        images: (p.images || []).slice(0, 1),
      }));
      localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(lightweight));
    } catch {
      // quota safe
    }
  }

  return finalLocalItem;
}

// Delete property with guaranteed Firestore persistence
export async function removeProperty(id: string): Promise<void> {
  // 1. Delete from Firestore
  const docRef = doc(db, PROPERTIES_COLLECTION, id);
  await deleteDoc(docRef);

  // 2. Update local cache
  const current = getLocalCachedProperties().filter((p) => p.id !== id);
  try {
    localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(current));
  } catch {
    // quota safe
  }
}

// Update site settings with guaranteed Firestore persistence
export async function saveSettings(settings: Partial<SiteSettings>): Promise<void> {
  const current = getLocalCachedSettings();
  const merged: SiteSettings = cleanFirestoreData({ ...current, ...settings });

  // 1. Sync to Firestore Cloud
  const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
  await setDoc(docRef, merged, { merge: true });

  // 2. Update local cache
  try {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(merged));
  } catch {
    // quota safe
  }
}

// Check active connection status
export async function checkFirestoreConnection(): Promise<{ connected: boolean; latencyMs?: number; error?: string }> {
  const start = Date.now();
  try {
    const testDoc = await getDoc(doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC));
    const latencyMs = Date.now() - start;
    return { connected: true, latencyMs };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { connected: false, error: errorMsg };
  }
}

// Force sync all properties to Firestore Cloud in batches
export async function syncAllPropertiesToCloud(customList?: Property[]): Promise<{ count: number; success: boolean }> {
  const listToSync = customList && customList.length > 0 ? customList : getLocalCachedProperties();
  try {
    // Firestore batch limits to 500 writes
    const batch = writeBatch(db);
    for (const prop of listToSync) {
      const propId = prop.id || `prop-${prop.code || Math.floor(100000 + Math.random() * 900000)}`;
      const docRef = doc(db, PROPERTIES_COLLECTION, propId);
      const sanitized = cleanFirestoreData({ ...prop, id: propId, updatedAt: Date.now() });
      batch.set(docRef, sanitized, { merge: true });
    }
    await batch.commit();
    
    // Also save settings
    const settingsDoc = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
    const sanitizedSettings = cleanFirestoreData(getLocalCachedSettings());
    await setDoc(settingsDoc, sanitizedSettings, { merge: true });

    return { count: listToSync.length, success: true };
  } catch (err) {
    console.error('Error syncing all properties to cloud:', err);
    throw err;
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

// ==========================================
// LANDING PAGES OPERATIONS
// ==========================================

export function getLocalCachedLandingPages(): LandingPage[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LANDING_PAGES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading local cached landing pages', e);
  }
  return [];
}

export function subscribeToLandingPages(
  callback: (landingPages: LandingPage[]) => void,
  onError?: (error: Error) => void
) {
  const colRef = collection(db, LANDING_PAGES_COLLECTION);

  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      const list: LandingPage[] = [];
      snapshot.forEach((docSnapshot) => {
        const docData = docSnapshot.data() as LandingPage;
        list.push({
          id: docSnapshot.id,
          ...docData,
        } as LandingPage);
      });

      // Sort newest first
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      // Cache locally
      try {
        localStorage.setItem(LOCAL_STORAGE_LANDING_PAGES_KEY, JSON.stringify(list));
      } catch {
        // Ignore quota
      }

      callback(list);
    },
    (err) => {
      console.warn('Firestore landing_pages onSnapshot error, using local cached:', err);
      callback(getLocalCachedLandingPages());
      if (onError) onError(err);
    }
  );

  return unsubscribe;
}

export const subscribeLandingPages = subscribeToLandingPages;

export async function saveLandingPage(landingPage: LandingPage): Promise<void> {
  const lpId = landingPage.id || `lp_${landingPage.propertyCode || 'prop'}_${Date.now()}`;
  const finalLP: LandingPage = cleanFirestoreData({
    ...landingPage,
    id: lpId,
    updatedAt: Date.now(),
    createdAt: landingPage.createdAt || Date.now(),
  });

  // Save to Firebase Firestore FIRST
  const docRef = doc(db, LANDING_PAGES_COLLECTION, lpId);
  await setDoc(docRef, finalLP, { merge: true });

  // Update local cache
  try {
    const current = getLocalCachedLandingPages();
    const index = current.findIndex((p) => p.id === lpId || p.slug === finalLP.slug);
    let updated: LandingPage[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = finalLP;
    } else {
      updated = [finalLP, ...current];
    }
    localStorage.setItem(LOCAL_STORAGE_LANDING_PAGES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error caching landing page locally', e);
  }
}

export async function deleteLandingPage(landingPageId: string): Promise<void> {
  // Delete from Firestore FIRST
  const docRef = doc(db, LANDING_PAGES_COLLECTION, landingPageId);
  await deleteDoc(docRef);

  // Update local cache
  try {
    const current = getLocalCachedLandingPages();
    const updated = current.filter((p) => p.id !== landingPageId);
    localStorage.setItem(LOCAL_STORAGE_LANDING_PAGES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error updating local cache on delete landing page', e);
  }
}

export async function getLandingPageBySlugOrCode(slugOrCode: string): Promise<LandingPage | null> {
  const clean = slugOrCode.trim().toLowerCase().replace(/^#/, '').replace(/^\/?lp\//, '');

  // Check local cache first
  const localList = getLocalCachedLandingPages();
  const cached = localList.find((lp) => 
    lp.slug?.toLowerCase() === clean || 
    lp.id?.toLowerCase() === clean ||
    lp.propertyCode?.toLowerCase() === clean ||
    `lp-${lp.propertyCode?.toLowerCase()}` === clean
  );
  if (cached) return cached;

  // Try Firestore lookup
  try {
    const colRef = collection(db, LANDING_PAGES_COLLECTION);
    const snap = await getDocs(colRef);
    let found: LandingPage | null = null;
    snap.forEach((d) => {
      const data = d.data() as LandingPage;
      if (
        data.slug?.toLowerCase() === clean || 
        d.id.toLowerCase() === clean ||
        data.propertyCode?.toLowerCase() === clean ||
        `lp-${data.propertyCode?.toLowerCase()}` === clean
      ) {
        found = { id: d.id, ...data };
      }
    });
    return found;
  } catch (err) {
    console.warn('Error fetching landing page from Firestore by slug:', err);
    return null;
  }
}

export async function incrementLandingPageView(landingPageId: string): Promise<void> {
  try {
    const docRef = doc(db, LANDING_PAGES_COLLECTION, landingPageId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as LandingPage;
      const newCount = (data.viewsCount || 0) + 1;
      await setDoc(docRef, { viewsCount: newCount }, { merge: true });
    }
  } catch {
    // Ignore metrics error
  }
}

export async function incrementLandingPageLead(landingPageId: string): Promise<void> {
  try {
    const docRef = doc(db, LANDING_PAGES_COLLECTION, landingPageId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as LandingPage;
      const newCount = (data.leadsCount || 0) + 1;
      await setDoc(docRef, { leadsCount: newCount }, { merge: true });
    }
  } catch {
    // Ignore metrics error
  }
}

