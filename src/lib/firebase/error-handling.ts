import { FirebaseError } from 'firebase/app';
import { FirestoreError } from 'firebase/firestore';
import { toast } from 'sonner';
import { setOnlineStatus } from './persistence';

export function handleFirebaseError(error: FirebaseError | FirestoreError, defaultMessage: string = 'An error occurred') {
  console.error(defaultMessage, error);

  switch (error.code) {
    case 'failed-precondition':
      // Handle offline mode gracefully
      setOnlineStatus(false);
      toast.warning('Operating in offline mode. Some features may be limited.');
      break;
      
    case 'unavailable':
      setOnlineStatus(false);
      toast.warning('Connection lost. Working offline.');
      break;
      
    case 'permission-denied':
      toast.error('You don\'t have permission to perform this action.');
      break;
      
    case 'not-found':
      toast.error('The requested resource was not found.');
      break;
      
    case 'cancelled':
      // Silently handle cancelled operations
      break;
      
    case 'deadline-exceeded':
      toast.error('Operation timed out. Please try again.');
      break;
      
    case 'resource-exhausted':
      toast.error('Too many requests. Please try again later.');
      break;
      
    case 'unauthenticated':
      toast.error('Please login to continue.');
      break;
      
    default:
      toast.error(error.message || defaultMessage);
  }
}