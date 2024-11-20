import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, Calendar as CalendarIcon, Clock, Plus, FileText, History } from 'lucide-react';
import { format } from 'date-fns';
import { VideoCall } from '@/components/video/VideoCall';
import { NotesDialog } from '@/components/dashboard/NotesDialog';

export function CoachingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const upcomingSessions = [
    {
      id: '1',
      coachId: 'coach123',
      coachName: 'Dr. Sarah Johnson',
      date: new Date('2024-03-20T15:00:00'),
      duration: 30,
      type: 'Nutrition Consultation',
      notes: 'Initial consultation to discuss dietary goals and current habits.'
    },
    {
      id: '2',
      coachId: 'coach456',
      coachName: 'Mike Thompson',
      date: new Date('2024-03-22T16:30:00'),
      duration: 45,
      type: 'Fitness Assessment',
      notes: 'First fitness assessment to establish baseline and set goals.'
    }
  ];

  const pastSessions = [
    {
      id: '3',
      coachId: 'coach123',
      coachName: 'Dr. Sarah Johnson',
      date: new Date('2024-03-10T15:00:00'),
      duration: 30,
      type: 'Nutrition Consultation',
      notes: 'Follow-up session to review progress and adjust meal plans.',
      status: 'completed'
    },
    {
      id: '4',
      coachId: 'coach456',
      coachName: 'Mike Thompson',
      date: new Date('2024-03-08T16:30:00'),
      duration: 45,
      type: 'Fitness Assessment',
      notes: 'Progress check and workout plan adjustment.',
      status: 'completed'
    }
  ];

  const handleJoinCall = (session: any) => {
    setSelectedSession(session);
    setShowVideoCall(true);
  };

  const handleViewNotes = (session: any) => {
    setSelectedSession(session);
    setShowNotes(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Coaching Sessions</h1>
        <p className="text-muted-foreground">
          Manage your coaching sessions and connect with your wellness experts.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-4">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past Sessions</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h3 className="font-semibold">{session.coachName}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Badge variant="outline">
                                    {session.type}
                                  </Badge>
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3" />
                                    {format(session.date, 'PPP')}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {format(session.date, 'p')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => handleViewNotes(session)}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Notes
                                </Button>
                                <Button
                                  onClick={() => handleJoinCall(session)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Video className="h-4 w-4 mr-2" />
                                  Join Call
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </TabsContent>

                <TabsContent value="past" className="space-y-4">
                  {pastSessions.map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h3 className="font-semibold">{session.coachName}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Badge variant="outline">
                                    {session.type}
                                  </Badge>
                                  <span className="flex items-center gap-1">
                                    <History className="h-3 w-3" />
                                    {format(session.date, 'PPP p')}
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                onClick={() => handleViewNotes(session)}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                View Notes
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Book New Session
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Coaches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...new Set(upcomingSessions.map(s => s.coachId))].map((coachId, index) => {
                const coach = upcomingSessions.find(s => s.coachId === coachId);
                return (
                  <div key={coachId} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {coach?.coachName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{coach?.coachName}</div>
                      <div className="text-sm text-muted-foreground">{coach?.type}</div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {showVideoCall && selectedSession && (
        <VideoCall
          open={showVideoCall}
          onOpenChange={setShowVideoCall}
          session={selectedSession}
          role="customer"
        />
      )}

      {showNotes && selectedSession && (
        <NotesDialog
          appointment={selectedSession}
          onOpenChange={(open) => !open && setShowNotes(false)}
        />
      )}
    </div>
  );
}