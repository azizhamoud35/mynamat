import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, TrendingUp, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export function HabitTracker() {
  const habits = [
    { name: 'Daily Exercise', progress: 80, streak: 7, badge: '🏃‍♂️ Fitness Enthusiast' },
    { name: 'Hydration', progress: 60, streak: 5, badge: '💧 Hydration Hero' },
    { name: 'Mindfulness', progress: 40, streak: 3, badge: '🧘‍♂️ Zen Master' },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Habit Tracking
          </CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Habit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {habits.map((habit, index) => (
            <motion.div
              key={habit.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{habit.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      <Trophy className="h-3 w-3 mr-1" />
                      {habit.streak} day streak
                    </Badge>
                  </div>
                  <Badge variant="outline" className="font-normal">
                    {habit.badge}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Log
                </Button>
              </div>
              <Progress value={habit.progress} className="h-2" />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}