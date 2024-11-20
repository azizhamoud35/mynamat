export interface SchedulingStep {
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  details?: string;
}

export interface SchedulingStats {
  totalCustomers: number;
  customersWithoutAppointments: number;
  availableCoaches: number;
  availableSlots: number;
  appointmentsCreated: number;
  customersProcessed: number;
  slotsChecked: number;
}

export interface SchedulingProgress {
  currentCustomer?: string;
  currentCoach?: string;
  currentAction?: string;
  steps: SchedulingStep[];
  stats?: SchedulingStats;
}

export interface SchedulingResult {
  success: boolean;
  appointmentsCreated: number;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Availability {
  id: string;
  coachId: string;
  coachName?: string;
  startDate: Date;
  endDate: Date;
  selectedDays: { [key: string]: string[] };
  status: 'pending' | 'approved' | 'rejected';
}