import { 
  collection, 
  query, 
  where, 
  getDocs, 
  DocumentData,
  Query,
  QuerySnapshot,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../config';

// Utility function to handle query execution with proper error handling
export async function executeQuery<T>(
  query: Query<DocumentData>
): Promise<T[]> {
  try {
    const snapshot = await getDocs(query);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

// Utility function to set up real-time listeners with proper cleanup
export function setupQueryListener<T>(
  query: Query<DocumentData>,
  onUpdate: (data: T[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    query,
    (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      onUpdate(data);
    },
    (error) => {
      console.error('Query listener error:', error);
      if (onError) onError(error);
    }
  );
}

// Utility function to create a base query with error handling
export function createBaseQuery(
  collectionName: string,
  ...conditions: any[]
) {
  try {
    return query(collection(db, collectionName), ...conditions);
  } catch (error) {
    console.error('Error creating query:', error);
    throw error;
  }
}