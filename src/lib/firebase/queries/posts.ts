import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  onSnapshot,
  Timestamp,
  QuerySnapshot,
  DocumentData,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../config';
import { handleFirebaseError } from '../error-handling';
import { toDate } from '../utils';
import { getOnlineStatus } from '../persistence';
import localforage from 'localforage';
import type { Post } from '@/types/support';

const POSTS_CACHE_KEY = 'groupPosts';
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

interface CachedData {
  posts: Post[];
  timestamp: number;
}

async function getCachedPosts(groupId: string): Promise<Post[]> {
  try {
    const cache = await localforage.getItem(`${POSTS_CACHE_KEY}_${groupId}`) as CachedData;
    if (!cache) return [];
    
    const isExpired = Date.now() - cache.timestamp > CACHE_EXPIRY;
    return isExpired ? [] : cache.posts;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return [];
  }
}

async function cachePosts(groupId: string, posts: Post[]) {
  try {
    await localforage.setItem(`${POSTS_CACHE_KEY}_${groupId}`, {
      posts,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
}

export function mapPostData(doc: DocumentData): Post {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: toDate(data.createdAt)
  };
}

export async function getGroupPosts(groupId: string, limitCount: number = 50): Promise<Post[]> {
  try {
    // First try to get from cache if offline
    if (!getOnlineStatus()) {
      const cachedPosts = await getCachedPosts(groupId);
      if (cachedPosts.length > 0) {
        return cachedPosts;
      }
    }

    const postsRef = collection(db, 'groupPosts');
    const postsQuery = query(
      postsRef,
      where('groupId', '==', groupId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(postsQuery);
    const posts = snapshot.docs.map(mapPostData);
    
    // Cache the results
    await cachePosts(groupId, posts);
    
    return posts;
  } catch (error) {
    handleFirebaseError(error as FirestoreError);
    
    // Fallback to cache on error
    const cachedPosts = await getCachedPosts(groupId);
    return cachedPosts;
  }
}

export function subscribeToGroupPosts(
  groupId: string,
  onUpdate: (posts: Post[]) => void,
  onError?: (error: Error) => void,
  limitCount: number = 50
) {
  const postsRef = collection(db, 'groupPosts');
  const postsQuery = query(
    postsRef,
    where('groupId', '==', groupId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  // First try to get cached data
  getCachedPosts(groupId).then(posts => {
    if (posts.length > 0) {
      onUpdate(posts);
    }
  });

  return onSnapshot(
    postsQuery,
    {
      next: async (snapshot: QuerySnapshot) => {
        const posts = snapshot.docs.map(mapPostData);
        await cachePosts(groupId, posts);
        onUpdate(posts);
      },
      error: async (error: FirestoreError) => {
        console.error('Posts subscription error:', error);
        
        // On error, try to serve cached data
        const cachedPosts = await getCachedPosts(groupId);
        if (cachedPosts.length > 0) {
          onUpdate(cachedPosts);
        }
        
        if (onError) onError(error);
        handleFirebaseError(error);
      }
    }
  );
}