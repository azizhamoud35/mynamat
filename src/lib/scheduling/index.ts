import { collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getCustomersWithoutAppointments, getApprovedAvailabilities } from './queries';
import type { SchedulingProgress, SchedulingResult } from './types';

export async function runAutoScheduling(
  onProgress: (progress: SchedulingProgress) => void
): Promise<SchedulingResult> {
  const steps = [
    { label: 'Finding customers', status: 'pending' as const },
    { label: 'Checking availabilities', status: 'pending' as const },
    { label: 'Creating appointments', status: 'pending' as const }
  ];

  let appointmentsCreated = 0;

  try {
    // Step 1: Finding customers
    onProgress({ steps: steps.map((s, i) => i === 0 ? { ...s, status: 'processing' } : s) });
    const customers = await getCustomersWithoutAppointments();
    steps[0].status = 'completed';
    steps[0].details = `Found ${customers.length} customers without appointments`;
    onProgress({ steps });

    if (customers.length === 0) {
      steps[1].status = 'completed';
      steps[1].details = 'No customers need appointments';
      steps[2].status = 'completed';
      steps[2].details = 'No appointments needed';
      onProgress({ steps });
      return { success: true, appointmentsCreated: 0 };
    }

    // Step 2: Checking availabilities
    steps[1].status = 'processing';
    onProgress({ steps });
    const availabilities = await getApprovedAvailabilities();
    steps[1].status = 'completed';
    steps[1].details = `Found ${availabilities.length} approved availabilities`;
    onProgress({ steps });

    if (availabilities.length === 0) {
      steps[2].status = 'completed';
      steps[2].details = 'No available time slots';
      onProgress({ steps });
      return { success: true, appointmentsCreated: 0 };
    }

    // Step 3: Creating appointments
    steps[2].status = 'processing';
    let customersProcessed = 0;

    for (const customer of customers) {
      customersProcessed++;
      onProgress({
        steps: steps.map(s => s.label === 'Creating appointments' ? {
          ...s,
          details: `Processing customer ${customersProcessed}/${customers.length}`
        } : s),
        currentCustomer: `${customer.firstName} ${customer.lastName}`
      });

      // Double check if customer still needs an appointment
      const existingAppointments = await getDocs(
        query(
          collection(db, 'appointments'),
          where('customerId', '==', customer.id),
          where('date', '>=', Timestamp.now())
        )
      );

      if (!existingAppointments.empty) {
        continue; // Skip if customer already has an appointment
      }

      for (const availability of availabilities) {
        onProgress({
          steps,
          currentCustomer: `${customer.firstName} ${customer.lastName}`,
          currentCoach: availability.coachName,
          currentAction: 'Checking slot availability'
        });

        // Check if slot is available
        const existingBookings = await getDocs(
          query(
            collection(db, 'appointments'),
            where('coachId', '==', availability.coachId),
            where('date', '==', Timestamp.fromDate(availability.startDate))
          )
        );

        if (!existingBookings.empty) {
          continue; // Slot already taken, try next availability
        }

        try {
          onProgress({
            steps,
            currentCustomer: `${customer.firstName} ${customer.lastName}`,
            currentCoach: availability.coachName,
            currentAction: 'Creating appointment'
          });

          await addDoc(collection(db, 'appointments'), {
            customerId: customer.id,
            customerName: `${customer.firstName} ${customer.lastName}`,
            coachId: availability.coachId,
            coachName: availability.coachName,
            date: Timestamp.fromDate(availability.startDate),
            status: 'scheduled',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          });

          appointmentsCreated++;
          onProgress({
            steps: steps.map(s => s.label === 'Creating appointments' ? {
              ...s,
              details: `Created ${appointmentsCreated} appointments (${customersProcessed}/${customers.length} customers)`
            } : s),
            currentCustomer: `${customer.firstName} ${customer.lastName}`,
            currentCoach: availability.coachName,
            currentAction: 'Appointment created successfully'
          });
          break; // Move to next customer after successful appointment creation
        } catch (error) {
          console.error('Error creating appointment:', error);
          continue; // Try next availability if this one fails
        }
      }
    }

    steps[2].status = 'completed';
    steps[2].details = `Created ${appointmentsCreated} appointments for ${customersProcessed} customers`;
    onProgress({ steps });

    return {
      success: true,
      appointmentsCreated
    };
  } catch (error) {
    console.error('Error in auto-scheduling:', error);
    const currentStep = steps.findIndex(step => step.status === 'processing');
    if (currentStep !== -1) {
      steps[currentStep].status = 'error';
      steps[currentStep].details = error instanceof Error ? error.message : 'Unknown error';
    }
    onProgress({ steps });
    throw error;
  }
}