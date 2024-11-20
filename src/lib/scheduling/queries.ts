import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Customer, Availability } from './types';

export async function getCustomersWithoutAppointments(): Promise<Customer[]> {
  try {
    // First get all customers
    const customersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'customer')
    );
    const customersSnapshot = await getDocs(customersQuery);
    const customers = customersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Customer[];

    // Then filter out those with existing appointments
    const now = Timestamp.now();
    const results: Customer[] = [];

    for (const customer of customers) {
      const appointmentsQuery = query(
        collection(db, 'appointments'),
        where('customerId', '==', customer.id),
        where('date', '>=', now)
      );
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      
      if (appointmentsSnapshot.empty) {
        results.push(customer);
      }
    }

    return results;
  } catch (error) {
    console.error('Error getting customers without appointments:', error);
    throw error;
  }
}

export async function getApprovedAvailabilities(): Promise<Availability[]> {
  try {
    const availabilitiesQuery = query(
      collection(db, 'availabilities'),
      where('status', '==', 'approved')
    );
    const snapshot = await getDocs(availabilitiesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startDate: doc.data().startDate.toDate(),
      endDate: doc.data().endDate.toDate()
    })) as Availability[];
  } catch (error) {
    console.error('Error getting approved availabilities:', error);
    throw error;
  }
}

export async function checkExistingAppointments(customerId: string): Promise<boolean> {
  try {
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('customerId', '==', customerId),
      where('date', '>=', Timestamp.now())
    );
    const snapshot = await getDocs(appointmentsQuery);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking existing appointments:', error);
    throw error;
  }
}