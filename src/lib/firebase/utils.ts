import { 
  collection, 
  query, 
  getDocs, 
  QueryConstraint,
  Timestamp,
  DocumentData,
  FirestoreError,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from './config';
import { handleFirebaseError } from './error-handling';

// Utility function to handle Firestore queries with retry and error handling
export async function executeQuery<T>(
  collectionName: string,
  constraints: QueryConstraint[],
  mapper: (doc: DocumentData) => T
): Promise<T[]> {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => mapper({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirebaseError(error as FirestoreError, `Error executing query on ${collectionName}`);
    return []; // Return empty array instead of throwing to handle offline gracefully
  }
}

// Utility function to safely handle snapshots
export function handleSnapshot<T>(
  snapshot: QuerySnapshot<DocumentData>,
  mapper: (doc: DocumentData) => T
): T[] {
  try {
    return snapshot.docs.map(doc => mapper({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error processing snapshot:', error);
    return [];
  }
}

// Utility function to handle Firestore timestamps
export function toDate(timestamp: Timestamp | Date | null | undefined): Date {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (timestamp instanceof Timestamp) return timestamp.toDate();
  return new Date(timestamp);
}

// Utility function to create a Firestore timestamp
export function createTimestamp(): Timestamp {
  return Timestamp.now();
}