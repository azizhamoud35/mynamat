import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Calendar, Clock, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { VideoCall } from '@/components/video/VideoCall';
import { Link } from 'react-router-dom';

export function CoachingSessions() {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);

  const upcomingSessions = [
    {
      id: '1',
      coachId: 'coach123',
      coachName: 'Dr. Sarah Johnson',
      date: new Date('2024-03-20T15:00:00'),
      duration: 30,
      type: 'Nutrition Consultation'
    },
    {
      id: '2',
      coachId: 'coach456',
      coachName: 'Mike Thompson',
      date: new Date('2024-03-22T16:30:00'),
      duration: 45,
      type: 'Fitness Assessment'
    }
  ];

  const handleJoinCall = (session: any) => {
    setSelectedSession(session);
    setShowVideoCall(true);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Coaching Sessions
            </CardTitle>
            <Link to="/coaching">
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Book Session
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="font-medium">{session.coachName}</div>
                  <div className="text-sm text-muted-foreground">
                    <Badge variant="outline" className="mr-2">
                      {session.type}
                    </Badge>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(session.date, 'PPP')}
                    </span>
                    <span className="inline-flex items-center gap-1 ml-2">
                      <Clock className="h-3 w-3" />
                      {format(session.date, 'p')}
                    </span>
                  </div>
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleJoinCall(session)}
                  className="bg-[#7dda55] hover:bg-[#6dc447] text-white"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join Call
                </Button>
              </motion.div>
            ))}

            {upcomingSessions.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No upcoming sessions scheduled
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showVideoCall && selectedSession && (
        <VideoCall
          open={showVideoCall}
          onOpenChange={setShowVideoCall}
          session={selectedSession}
          role="customer"
        />
      )}
    </>
  );
}