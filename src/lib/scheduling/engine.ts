import { collection, query, where, getDocs, Timestamp, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';

export interface SchedulingProgress {
  steps: {
    label: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    details?: string;
  }[];
  stats: {
    totalCustomers: number;
    customersWithoutAppointments: number;
    availableCoaches: number;
    availableSlots: number;
    appointmentsCreated: number;
    customersProcessed: number;
    slotsChecked: number;
  };
  currentCustomer?: string;
  currentCoach?: string;
  currentAction?: string;
}

export async function runAutoScheduling(
  onProgress: (progress: SchedulingProgress) => void
): Promise<{ success: boolean; appointmentsCreated: number }> {
  const progress: SchedulingProgress = {
    steps: [
      { label: 'Finding customers', status: 'pending' },
      { label: 'Checking availabilities', status: 'pending' },
      { label: 'Creating appointments', status: 'pending' }
    ],
    stats: {
      totalCustomers: 0,
      customersWithoutAppointments: 0,
      availableCoaches: 0,
      availableSlots: 0,
      appointmentsCreated: 0,
      customersProcessed: 0,
      slotsChecked: 0
    }
  };

  try {
    // Step 1: Find customers without appointments
    progress.steps[0].status = 'processing';
    onProgress({ ...progress });

    const customersSnapshot = await getDocs(
      query(collection(db, 'users'), where('role', '==', 'customer'))
    );
    
    progress.stats.totalCustomers = customersSnapshot.size;
    const customers = customersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const now = new Date();
    const customersWithoutAppointments = [];

    for (const customer of customers) {
      // Check appointments one by one to avoid compound index
      const appointmentsSnapshot = await getDocs(
        query(collection(db, 'appointments'), where('customerId', '==', customer.id))
      );

      const hasUpcoming = appointmentsSnapshot.docs.some(doc => {
        const appointmentDate = doc.data().date.toDate();
        return appointmentDate >= now;
      });

      if (!hasUpcoming) {
        customersWithoutAppointments.push(customer);
      }
    }

    progress.stats.customersWithoutAppointments = customersWithoutAppointments.length;
    progress.steps[0].status = 'completed';
    progress.steps[0].details = `Found ${customersWithoutAppointments.length} customers without appointments`;
    onProgress({ ...progress });

    // Step 2: Get available coaches and their availabilities
    progress.steps[1].status = 'processing';
    onProgress({ ...progress });

    const coachesSnapshot = await getDocs(
      query(collection(db, 'users'), where('role', '==', 'coach'))
    );
    const coaches = coachesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    progress.stats.availableCoaches = coaches.length;
    progress.steps[1].details = `Found ${coaches.length} available coaches`;
    progress.steps[1].status = 'completed';
    onProgress({ ...progress });

    // Step 3: Create appointments
    progress.steps[2].status = 'processing';
    onProgress({ ...progress });

    let appointmentsCreated = 0;

    for (const customer of customersWithoutAppointments) {
      progress.stats.customersProcessed++;
      progress.currentCustomer = `${customer.firstName} ${customer.lastName}`;
      onProgress({ ...progress });

      for (const coach of coaches) {
        progress.currentCoach = `${coach.firstName} ${coach.lastName}`;
        onProgress({ ...progress });

        // Get coach's approved availabilities
        const availabilitiesSnapshot = await getDocs(
          query(
            collection(db, 'availabilities'),
            where('coachId', '==', coach.id),
            where('status', '==', 'approved')
          )
        );

        for (const availabilityDoc of availabilitiesSnapshot.docs) {
          const availability = availabilityDoc.data();
          const startDate = availability.startDate.toDate();
          const endDate = availability.endDate.toDate();

          if (endDate < now) continue;

          // Generate time slots based on availability
          const slots = generateTimeSlots(startDate, endDate, availability.selectedDays || {});
          progress.stats.availableSlots += slots.length;

          for (const slot of slots) {
            progress.stats.slotsChecked++;
            progress.currentAction = `Checking slot: ${format(slot, 'PPp')}`;
            onProgress({ ...progress });

            // Check if slot is already taken
            const existingAppointmentsSnapshot = await getDocs(
              query(
                collection(db, 'appointments'),
                where('coachId', '==', coach.id),
                where('date', '==', Timestamp.fromDate(slot))
              )
            );

            if (existingAppointmentsSnapshot.empty) {
              // Create appointment
              await addDoc(collection(db, 'appointments'), {
                customerId: customer.id,
                coachId: coach.id,
                date: Timestamp.fromDate(slot),
                status: 'scheduled',
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
              });

              appointmentsCreated++;
              progress.stats.appointmentsCreated = appointmentsCreated;
              progress.currentAction = `Created appointment for ${format(slot, 'PPp')}`;
              onProgress({ ...progress });
              break; // Move to next customer
            }
          }

          if (appointmentsCreated > progress.stats.appointmentsCreated) break; // Move to next customer
        }

        if (appointmentsCreated > progress.stats.appointmentsCreated) break; // Move to next customer
      }
    }

    progress.steps[2].status = 'completed';
    progress.steps[2].details = `Created ${appointmentsCreated} appointments`;
    progress.currentCustomer = undefined;
    progress.currentCoach = undefined;
    progress.currentAction = undefined;
    onProgress({ ...progress });

    return { success: true, appointmentsCreated };
  } catch (error) {
    console.error('Error in auto-scheduling:', error);
    const currentStep = progress.steps.findIndex(step => step.status === 'processing');
    if (currentStep !== -1) {
      progress.steps[currentStep].status = 'error';
      progress.steps[currentStep].details = 'An error occurred during this step';
    }
    onProgress({ ...progress });
    throw error;
  }
}

function generateTimeSlots(startDate: Date, endDate: Date, selectedDays: { [key: string]: string[] }): Date[] {
  const slots: Date[] = [];
  const now = new Date();
  
  // Skip if availability is in the past
  if (endDate < now) return slots;
  
  // Start from today or availability start date, whichever is later
  let currentDate = startDate < now ? now : startDate;
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay().toString();
    const selectedSessions = selectedDays[dayOfWeek] || [];

    for (const session of selectedSessions) {
      const sessionTimes = getSessionTimes(session);
      if (!sessionTimes) continue;

      let slotTime = new Date(currentDate);
      slotTime.setHours(sessionTimes.start.hours, sessionTimes.start.minutes, 0, 0);
      
      const sessionEnd = new Date(currentDate);
      sessionEnd.setHours(sessionTimes.end.hours, sessionTimes.end.minutes, 0, 0);

      while (slotTime < sessionEnd) {
        if (slotTime > now) {
          slots.push(new Date(slotTime));
        }
        slotTime = new Date(slotTime.getTime() + 15 * 60000); // Add 15 minutes
      }
    }

    currentDate = new Date(currentDate.getTime() + 24 * 60 * 60000); // Next day
  }

  return slots.sort((a, b) => a.getTime() - b.getTime());
}

function getSessionTimes(session: string) {
  const SESSION_TIMES = {
    session1: { start: { hours: 17, minutes: 0 }, end: { hours: 20, minutes: 0 } },
    session2: { start: { hours: 20, minutes: 0 }, end: { hours: 22, minutes: 0 } }
  };
  return SESSION_TIMES[session as keyof typeof SESSION_TIMES];
}