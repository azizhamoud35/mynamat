import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, XCircle, FileText, Phone } from 'lucide-react';
import { NotesDialog } from './NotesDialog';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  date: Date | Timestamp;
  status: 'scheduled' | 'completed' | 'missed';
  notes?: string;
  coachId: string;
}

export function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.uid) {
      fetchAppointments();
    }
  }, [currentUser]);

  const fetchAppointments = async () => {
    if (!currentUser?.uid) return;

    try {
      setLoading(true);
      const appointmentsQuery = query(
        collection(db, 'appointments'),
        where('coachId', '==', currentUser.uid),
        where('date', '>=', Timestamp.now())
      );
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      
      // Get all unique customer IDs
      const customerIds = new Set(
        appointmentsSnapshot.docs.map(doc => doc.data().customerId)
      );

      // Fetch all customers in one query
      const customersSnapshot = await getDocs(
        query(collection(db, 'users'), where('role', '==', 'customer'))
      );
      
      // Create a map of customer IDs to names and phones
      const customerInfo = new Map();
      customersSnapshot.docs.forEach(doc => {
        const data = doc.data();
        customerInfo.set(doc.id, {
          name: `${data.firstName} ${data.lastName}`,
          phone: data.phone
        });
      });

      const appointmentsData = appointmentsSnapshot.docs.map(doc => {
        const data = doc.data();
        const customerData = customerInfo.get(data.customerId);
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate(), // Convert Timestamp to Date
          customerName: customerData?.name || 'Unknown Customer',
          customerPhone: customerData?.phone
        };
      });

      setAppointments(appointmentsData.sort((a, b) => a.date.getTime() - b.date.getTime()));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId: string, status: 'completed' | 'missed') => {
    try {
      setProcessingId(appointmentId);
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status,
        updatedAt: Timestamp.now()
      });
      
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status } : apt
      ));
      
      toast.success(`Appointment marked as ${status}`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 md:p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-6 md:py-8 text-muted-foreground">
        No upcoming appointments
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card gap-4"
        >
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{appointment.customerName}</span>
              {appointment.customerPhone && (
                <a 
                  href={`tel:${appointment.customerPhone}`}
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
                >
                  <Phone className="h-3 w-3 mr-1" />
                  {appointment.customerPhone}
                </a>
              )}
              <Badge variant={
                appointment.status === 'completed' ? 'success' :
                appointment.status === 'missed' ? 'destructive' :
                'secondary'
              }>
                {appointment.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {format(appointment.date, 'PPP p')}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {appointment.status === 'scheduled' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-500 hover:bg-green-500 hover:text-white"
                  onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                  disabled={!!processingId}
                >
                  {processingId === appointment.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  <span className="hidden sm:inline">Attended</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => handleUpdateStatus(appointment.id, 'missed')}
                  disabled={!!processingId}
                >
                  {processingId === appointment.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  <span className="hidden sm:inline">Did Not Attend</span>
                </Button>
              </>
            )}
            <Button
              size="sm"
              onClick={() => setSelectedAppointment(appointment)}
              className="border-[#004250] text-[#004250] hover:bg-[#004250] hover:text-white"
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Open File</span>
            </Button>
          </div>
        </div>
      ))}

      <NotesDialog
        appointment={selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
        onNotesUpdate={(id, notes) => {
          setAppointments(prev => prev.map(apt => 
            apt.id === id ? { ...apt, notes } : apt
          ));
        }}
      />
    </div>
  );
}