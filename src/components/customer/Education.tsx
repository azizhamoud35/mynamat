import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, PlayCircle, BookOpen, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

export function MiniCourses() {
  const courses = [
    {
      title: 'Nutrition Fundamentals',
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
      category: 'Nutrition',
      certificate: false
    },
    {
      title: 'Stress Management 101',
      progress: 100,
      totalLessons: 8,
      completedLessons: 8,
      category: 'Wellness',
      certificate: true
    },
    {
      title: 'Home Workout Mastery',
      progress: 30,
      totalLessons: 15,
      completedLessons: 5,
      category: 'Fitness',
      certificate: false
    }
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Mini Courses
          </CardTitle>
          <Button size="sm" variant="outline">
            <BookOpen className="h-4 w-4 mr-2" />
            Browse Courses
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{course.title}</span>
                    {course.certificate && (
                      <Badge className="bg-[#7dda55] text-white">
                        <Award className="h-3 w-3 mr-1" />
                        Certified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">
                      {course.category}
                    </Badge>
                    <span>
                      {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Continue
                </Button>
              </div>
              <Progress value={course.progress} className="h-2" />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}