import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Label } from '@/components/ui/label';
import { runAutoScheduling } from '@/lib/scheduling';
import { Loader2, CheckCircle2, XCircle, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SchedulingProgress } from '@/lib/scheduling/types';

export function AutoSchedulingToggle() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<SchedulingProgress>({
    steps: [
      { label: 'Finding customers', status: 'pending' },
      { label: 'Checking availabilities', status: 'pending' },
      { label: 'Creating appointments', status: 'pending' }
    ]
  });
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    loadAutoSchedulingState();
  }, []);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const loadAutoSchedulingState = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'autoScheduling'));
      const enabled = settingsDoc.exists() ? settingsDoc.data().enabled : false;
      setIsEnabled(enabled);
      if (enabled) {
        handleAutoScheduling();
      }
    } catch (error) {
      console.error('Error loading auto-scheduling state:', error);
      addLog('Failed to load auto-scheduling state');
    }
  };

  const handleToggle = async (checked: boolean) => {
    try {
      setIsProcessing(true);
      setLogs([]); // Clear previous logs
      
      await setDoc(doc(db, 'settings', 'autoScheduling'), {
        enabled: checked,
        updatedAt: new Date()
      });
      
      setIsEnabled(checked);
      
      if (checked) {
        addLog('Auto-scheduling enabled, starting process...');
        await handleAutoScheduling();
        toast.success('Auto-scheduling enabled');
      } else {
        addLog('Auto-scheduling disabled');
        toast.success('Auto-scheduling disabled');
        setProgress({
          steps: progress.steps.map(step => ({ ...step, status: 'pending', details: undefined }))
        });
      }
    } catch (error) {
      console.error('Error toggling auto-scheduling:', error);
      addLog(`Error: ${error instanceof Error ? error.message : 'Failed to toggle auto-scheduling'}`);
      toast.error('Failed to toggle auto-scheduling');
      setIsEnabled(!checked);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAutoScheduling = async () => {
    try {
      setIsProcessing(true);
      const result = await runAutoScheduling((newProgress) => {
        setProgress(newProgress);
        if (newProgress.currentAction) {
          addLog(newProgress.currentAction);
        }
      });
      
      if (result.appointmentsCreated > 0) {
        addLog(`Successfully created ${result.appointmentsCreated} appointments`);
        toast.success(`Created ${result.appointmentsCreated} new appointments`);
      } else {
        addLog('No appointments needed to be created');
        toast.info('No new appointments needed');
      }
    } catch (error) {
      console.error('Error in auto-scheduling:', error);
      addLog(`Error: ${error instanceof Error ? error.message : 'Auto-scheduling failed'}`);
      toast.error('Auto-scheduling check failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const getProgressValue = () => {
    const completed = progress.steps.filter(step => step.status === 'completed').length;
    return (completed / progress.steps.length) * 100;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Switch
          id="auto-scheduling"
          checked={isEnabled}
          onCheckedChange={handleToggle}
          disabled={isProcessing}
        />
        <div className="flex items-center gap-2">
          <Label htmlFor="auto-scheduling" className="text-sm font-medium">
            Auto-Schedule
          </Label>
          {isProcessing && <Loader2 className="h-3 w-3 animate-spin" />}
        </div>
      </div>

      {(isProcessing || progress.steps.some(step => step.status !== 'pending')) && (
        <div className="space-y-3 bg-muted/50 rounded-lg p-4">
          <Progress value={getProgressValue()} className="h-2" />
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {/* Progress Steps */}
              <div className="space-y-2">
                {progress.steps.map((step, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      {step.status === 'processing' ? (
                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      ) : step.status === 'completed' ? (
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                      ) : step.status === 'error' ? (
                        <XCircle className="h-3 w-3 text-destructive" />
                      ) : (
                        <span className="h-3 w-3 rounded-full border" />
                      )}
                      <span className={
                        step.status === 'processing' ? 'text-primary font-medium' :
                        step.status === 'error' ? 'text-destructive' :
                        ''
                      }>
                        {step.label}
                      </span>
                    </div>
                    {step.details && (
                      <p className="text-xs text-muted-foreground ml-5">
                        {step.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Stats Summary */}
              {progress.stats && (
                <div className="border-t pt-2">
                  <h4 className="text-sm font-medium mb-2">Statistics</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>Customers without appointments: {progress.stats.customersWithoutAppointments}</div>
                    <div>Available coaches: {progress.stats.availableCoaches}</div>
                    <div>Available slots: {progress.stats.availableSlots}</div>
                    <div>Slots checked: {progress.stats.slotsChecked}</div>
                    <div>Customers processed: {progress.stats.customersProcessed}</div>
                    <div>Appointments created: {progress.stats.appointmentsCreated}</div>
                  </div>
                </div>
              )}

              {/* Current Operation Details */}
              {(progress.currentCustomer || progress.currentCoach || progress.currentAction) && (
                <div className="border-t pt-2">
                  <h4 className="text-sm font-medium mb-2">Current Operation</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {progress.currentCustomer && (
                      <p className="flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Processing: {progress.currentCustomer}
                      </p>
                    )}
                    {progress.currentCoach && (
                      <p className="flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        With Coach: {progress.currentCoach}
                      </p>
                    )}
                    {progress.currentAction && (
                      <p className="flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Action: {progress.currentAction}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Detailed Logs */}
              {logs.length > 0 && (
                <div className="border-t pt-2">
                  <h4 className="text-sm font-medium mb-2">Detailed Logs</h4>
                  <div className="space-y-1">
                    {logs.map((log, index) => (
                      <p key={index} className="text-xs text-muted-foreground">
                        {log}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}