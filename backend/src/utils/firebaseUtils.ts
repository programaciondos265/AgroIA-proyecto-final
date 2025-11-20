import { firestore } from '../config/firebase';

/**
 * Verifica si Firebase Firestore está disponible
 * @returns true si Firestore está disponible, false en caso contrario
 */
export const isFirestoreAvailable = (): boolean => {
  if (!firestore) {
    console.error('❌ Firebase Firestore no está disponible');
    return false;
  }
  return true;
};

/**
 * Verifica si Firebase Firestore está disponible y lanza un error si no lo está
 * @throws Error si Firestore no está disponible
 */
export const ensureFirestoreAvailable = (): void => {
  if (!firestore) {
    throw new Error('Firebase Firestore no está disponible');
  }
};

