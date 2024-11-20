import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentList } from '@/components/dashboard/AppointmentList';
import { CoachAvailabilityList } from '@/components/dashboard/CoachAvailabilityList';

export function CoachDashboard() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Coach Dashboard</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Manage your appointments and availability schedule.
        </p>
      </div>

      <div className="grid gap-6 md:gap-8">
        <Card className="overflow-hidden">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl">Appointments</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <AppointmentList />
          </CardContent>
        </Card>

        <CoachAvailabilityList />
      </div>
    </div>
  );
}