import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, PlayCircle, BookOpen, Award, Clock, CheckCircle, Lock } from 'lucide-react';

export function EducationPage() {
  const [selectedTab, setSelectedTab] = useState('inProgress');

  const courses = {
    inProgress: [
      {
        id: '1',
        title: 'Nutrition Fundamentals',
        description: 'Learn the basics of nutrition and healthy eating habits.',
        progress: 75,
        totalLessons: 12,
        completedLessons: 9,
        category: 'Nutrition',
        certificate: false,
        nextLesson: 'Understanding Macronutrients',
        timeLeft: '2 hours'
      },
      {
        id: '2',
        title: 'Home Workout Mastery',
        description: 'Master effective workouts you can do at home.',
        progress: 30,
        totalLessons: 15,
        completedLessons: 5,
        category: 'Fitness',
        certificate: false,
        nextLesson: 'Bodyweight Exercises',
        timeLeft: '4 hours'
      }
    ],
    completed: [
      {
        id: '3',
        title: 'Stress Management 101',
        description: 'Essential techniques for managing daily stress.',
        progress: 100,
        totalLessons: 8,
        completedLessons: 8,
        category: 'Wellness',
        certificate: true,
        completionDate: '2024-03-01'
      }
    ],
    available: [
      {
        id: '4',
        title: 'Mindful Meditation',
        description: 'Introduction to meditation and mindfulness practices.',
        totalLessons: 10,
        category: 'Wellness',
        duration: '6 hours'
      },
      {
        id: '5',
        title: 'Advanced Nutrition',
        description: 'Deep dive into advanced nutrition concepts.',
        totalLessons: 15,
        category: 'Nutrition',
        duration: '8 hours',
        locked: true
      }
    ]
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Education Center</h1>
        <p className="text-muted-foreground">
          Expand your knowledge with our comprehensive wellness courses.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Your Learning Journey</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="w-full justify-start rounde d-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="inProgress"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                  >
                    In Progress
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                  >
                    Completed
                  </TabsTrigger>
                  <TabsTrigger
                    value="available"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                  >
                    Available
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="inProgress" className="p-6">
                  <div className="space-y-6">
                    {courses.inProgress.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card>
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <h3 className="font-semibold text-lg">{course.title}</h3>
                                  <p className="text-sm text-muted-foreground">{course.description}</p>
                                </div>
                                <Button>
                                  <PlayCircle className="h-4 w-4 mr-2" />
                                  Continue
                                </Button>
                              </div>

                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{course.category}</Badge>
                                <span className="text-sm text-muted-foreground">
                                  {course.completedLessons}/{course.totalLessons} lessons
                                </span>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
                              </div>

                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <BookOpen className="h-4 w-4" />
                                  Next: {course.nextLesson}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {course.timeLeft} left
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="completed" className="p-6">
                  <div className="space-y-6">
                    {courses.completed.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card>
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <h3 className="font-semibold text-lg">{course.title}</h3>
                                  <p className="text-sm text-muted-foreground">{course.description}</p>
                                </div>
                                <Badge className="bg-green-500">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Completed
                                </Badge>
                              </div>

                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{course.category}</Badge>
                                {course.certificate && (
                                  <Badge variant="outline" className="border-green-500 text-green-500">
                                    <Award className="h-3 w-3 mr-1" />
                                    Certificate Earned
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Completed all {course.totalLessons} lessons</span>
                                <Button variant="outline" size="sm">
                                  Review Course
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="available" className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {courses.available.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card>
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <h3 className="font-semibold text-lg">{course.title}</h3>
                                <p className="text-sm text-muted-foreground">{course.description}</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{course.category}</Badge>
                                <span className="text-sm text-muted-foreground">
                                  {course.totalLessons} lessons
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {course.duration}
                                </span>
                              </div>

                              <Button className="w-full" disabled={course.locked}>
                                {course.locked ? (
                                  <>
                                    <Lock className="h-4 w-4 mr-2" />
                                    Unlock Course
                                  </>
                                ) : (
                                  <>
                                    <PlayCircle className="h-4 w-4 mr-2" />
                                    Start Course
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Courses Completed</span>
                  <span>1/4</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Learning Hours</span>
                  <span>12 hrs</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Certificates Earned</span>
                  <span>1</span>
                </div>
                <Progress value={33} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Daily Streak</span>
                  <Badge variant="outline">5 days</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Weekly Goal</span>
                  <Badge variant="outline">3/5 hours</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Focus Areas</span>
                  <div className="flex gap-1">
                    <Badge variant="secondary">Nutrition</Badge>
                    <Badge variant="secondary">Fitness</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}