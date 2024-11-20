import { 
  collection, 
  query, 
  where, 
  Timestamp, 
  addDoc,
  orderBy
} from 'firebase/firestore';
import { db } from '../config';
import { executeQuery, setupQueryListener } from './base';
import type { Appointment } from '@/types';

interface AppointmentData {
  customerId: string;
  coachId: string;
  date: Date;
  status: string;
}

export async function createAppointment(data: AppointmentData) {
  try {
    return await addDoc(collection(db, 'appointments'), {
      ...data,
      date: Timestamp.fromDate(data.date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

export async function getUpcomingAppointments(userId: string, role: 'coach' | 'customer') {
  const fieldName = role === 'coach' ? 'coachId' : 'customerId';
  const baseQuery = query(
    collection(db, 'appointments'),
    where(fieldName, '==', userId),
    where('date', '>=', Timestamp.now()),
    orderBy('date', 'asc')
  );

  return executeQuery<Appointment>(baseQuery);
}

export function watchUpcomingAppointments(
  userId: string,
  role: 'coach' | 'customer',
  onUpdate: (appointments: Appointment[]) => void,
  onError?: (error: Error) => void
) {
  const fieldName = role === 'coach' ? 'coachId' : 'customerId';
  const baseQuery = query(
    collection(db, 'appointments'),
    where(fieldName, '==', userId),
    where('date', '>=', Timestamp.now()),
    orderBy('date', 'asc')
  );

  return setupQueryListener<Appointment>(baseQuery, onUpdate, onError);
}