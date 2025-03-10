import { useState, useEffect } from 'react';
import { collection, query, orderBy, Timestamp, where, onSnapshot, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Calendar, Trash2 } from 'lucide-react';
import { ManualSchedulingDialog } from './ManualSchedulingDialog';
import { AutoSchedulingToggle } from './AutoSchedulingToggle';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Appointment {
  id: string;
  customerId: string;
  coachId: string;
  customerName?: string;
  coachName?: string;
  date: any;
  status: string;
}

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManualScheduling, setShowManualScheduling] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [processingDelete, setProcessingDelete] = useState(false);

  useEffect(() => {
    // Set up real-time listener for appointments
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('date', '>=', Timestamp.now()),
      orderBy('date', 'asc')
    );

    const unsubscribe = onSnapshot(
      appointmentsQuery,
      async (snapshot) => {
        const appointmentsData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data();
            
            // Get customer and coach data
            const [customerDoc, coachDoc] = await Promise.all([
              getDocs(query(collection(db, 'users'), where('id', '==', data.customerId))),
              getDocs(query(collection(db, 'users'), where('id', '==', data.coachId)))
            ]);

            const customerData = customerDoc.docs[0]?.data();
            const coachData = coachDoc.docs[0]?.data();

            return {
              id: doc.id,
              ...data,
              date: data.date.toDate(),
              customerName: customerData ? 
                `${customerData.firstName} ${customerData.lastName}` : 
                data.customerName || 'Unknown Customer',
              coachName: coachData ? 
                `${coachData.firstName} ${coachData.lastName}` : 
                data.coachName || 'Unknown Coach'
            };
          })
        );

        setAppointments(appointmentsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to appointments:', error);
        toast.error('Failed to load appointments');
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setProcessingDelete(true);
      await deleteDoc(doc(db, 'appointments', deleteId));
      toast.success('Appointment deleted successfully');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment');
    } finally {
      setProcessingDelete(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <AutoSchedulingToggle />
          <Button onClick={() => setShowManualScheduling(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Manual Schedule
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 md:p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h3 className="font-semibold">{appointment.customerName}</h3>
                  <span className="text-muted-foreground">with</span>
                  <h3 className="font-semibold">{appointment.coachName}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(appointment.date, 'PPP p')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={
                  appointment.status === 'completed' ? 'success' :
                  appointment.status === 'missed' ? 'destructive' :
                  'secondary'
                }>
                  {appointment.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(appointment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {appointments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No appointments found
          </div>
        )}
      </div>

      <ManualSchedulingDialog
        open={showManualScheduling}
        onOpenChange={setShowManualScheduling}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processingDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={processingDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {processingDelete ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}