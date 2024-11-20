export type UserRole = 'admin' | 'coach' | 'customer';
export type AppointmentStatus = 'scheduled' | 'completed' | 'missed';
export type AvailabilityStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface DayAvailability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  timeSlots: TimeSlot[];
}

export interface Availability {
  id: string;
  coachId: string;
  startDate: Date;
  endDate: Date;
  status: AvailabilityStatus;
  days: DayAvailability[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  coachId: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  date: Date;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}