import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  Firestore,
  enableMultiTabIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB5iBTjS3w-POPzBTlWSEyvph2X43NET2I",
  authDomain: "namat-clinic.firebaseapp.com",
  projectId: "namat-clinic",
  storageBucket: "namat-clinic.appspot.com",
  messagingSenderId: "392594971153",
  appId: "1:392594971153:web:334d410c74ac8f84106fb0"
};

// Initialize Firebase app
let app: FirebaseApp;
try {
  app = getApp();
} catch {
  app = initializeApp(firebaseConfig);
}

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore with persistence
let firestoreInstance: Firestore;

try {
  firestoreInstance = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  });
  
  // Enable multi-tab persistence
  enableMultiTabIndexedDbPersistence(firestoreInstance).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('Browser doesn\'t support persistence');
    }
  });
} catch (err) {
  console.warn('Using existing Firestore instance');
  firestoreInstance = getFirestore(app);
}

export const db = firestoreInstance;
export default app;