import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore';
import { db } from './config';
import { toast } from 'sonner';
import localforage from 'localforage';

// Initialize localforage instance for offline data
const offlineStore = localforage.createInstance({
  name: 'namatClinic',
  storeName: 'offlineData'
});

let isOnline = navigator.onLine;
let persistenceEnabled = false;

// Listen for online/offline events
window.addEventListener('online', () => setOnlineStatus(true));
window.addEventListener('offline', () => setOnlineStatus(false));

export async function enablePersistence() {
  if (persistenceEnabled) return;

  try {
    await enableIndexedDbPersistence(db);
    persistenceEnabled = true;
    console.log('Persistence enabled successfully');
  } catch (err: any) {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, use local storage fallback
      console.warn('Multiple tabs open, using local storage fallback');
      await setupLocalStorageFallback();
    } else if (err.code === 'unimplemented') {
      console.warn('Browser doesn\'t support persistence, using local storage fallback');
      await setupLocalStorageFallback();
    }
  }
}

async function setupLocalStorageFallback() {
  try {
    await offlineStore.setDriver([
      localforage.INDEXEDDB,
      localforage.WEBSQL,
      localforage.LOCALSTORAGE
    ]);
    console.log('Local storage fallback initialized');
  } catch (error) {
    console.error('Error setting up local storage fallback:', error);
  }
}

export async function setOnlineStatus(online: boolean) {
  if (online === isOnline) return;
  isOnline = online;

  try {
    if (online) {
      await syncOfflineData();
      await db.enableNetwork();
      toast.success('Connected to network');
    } else {
      await db.disableNetwork();
      toast.warning('Working offline');
    }
  } catch (error) {
    console.error('Error changing network status:', error);
    // Don't throw - allow app to continue functioning
  }
}

async function syncOfflineData() {
  try {
    const offlineData = await offlineStore.getItem('pendingChanges') as any[];
    if (!offlineData?.length) return;

    console.log('Syncing offline data...');
    for (const change of offlineData) {
      try {
        const { collection, data } = change;
        await db.collection(collection).add(data);
      } catch (error) {
        console.error('Error syncing offline change:', error);
      }
    }

    await offlineStore.removeItem('pendingChanges');
    console.log('Offline data sync complete');
  } catch (error) {
    console.error('Error syncing offline data:', error);
  }
}

export function getOnlineStatus() {
  return isOnline;
}

export function getDb() {
  return getFirestore();
}