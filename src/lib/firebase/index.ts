// Re-export everything from config
export * from './config';

// Re-export specific functions
export { getDb } from './persistence';
export { executeQuery, toDate } from './utils';
export { handleFirebaseError } from './error-handling';