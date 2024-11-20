import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Target, Trophy, TrendingUp, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

export function HabitsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [habits, setHabits] = useState([
    { 
      id: '1',
      name: 'Daily Exercise',
      progress: 80,
      streak: 7,
      badge: '🏃‍♂️ Fitness Enthusiast',
      history: Array.from({ length: 30 }, () => Math.random() > 0.3)
    },
    { 
      id: '2',
      name: 'Hydration',
      progress: 60,
      streak: 5,
      badge: '💧 Hydration Hero',
      history: Array.from({ length: 30 }, () => Math.random() > 0.3)
    },
    { 
      id: '3',
      name: 'Mindfulness',
      progress: 40,
      streak: 3,
      badge: '🧘‍♂️ Zen Master',
      history: Array.from({ length: 30 }, () => Math.random() > 0.3)
    },
    { 
      id: '4',
      name: 'Healthy Eating',
      progress: 75,
      streak: 4,
      badge: '🥗 Nutrition Pro',
      history: Array.from({ length: 30 }, () => Math.random() > 0.3)
    }
  ]);

  const handleLogHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        return {
          ...habit,
          progress: Math.min(100, habit.progress + 5),
          streak: habit.streak + 1
        };
      }
      return habit;
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Habit Tracking</h1>
        <p className="text-muted-foreground">
          Track your daily habits and build lasting routines.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{habit.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="font-normal">
                            {habit.badge}
                          </Badge>
                          <Badge variant="outline">
                            <Trophy className="h-3 w-3 mr-1" />
                            {habit.streak} day streak
                          </Badge>
                        </div>
                      </div>
                      <Button onClick={() => handleLogHabit(habit.id)}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Log Today
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{habit.progress}%</span>
                      </div>
                      <Progress value={habit.progress} className="h-2" />
                    </div>

                    <div className="flex gap-1">
                      {habit.history.map((completed, i) => (
                        <div
                          key={i}
                          className={`h-2 w-2 rounded-full ${
                            completed ? 'bg-primary' : 'bg-muted'
                          }`}
                          title={format(
                            new Date(Date.now() - i * 24 * 60 * 60 * 1000),
                            'PP'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Habit
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar View
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
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Monthly Goal</span>
                  <span>24/30 days</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Streak Goal</span>
                  <span>7/10 days</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}