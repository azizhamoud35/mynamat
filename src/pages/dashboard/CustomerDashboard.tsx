import { motion } from 'framer-motion';
import { HabitTracker } from '@/components/customer/HabitTracker';
import { SupportGroups } from '@/components/customer/SupportGroups';
import { CoachingSessions } from '@/components/customer/CoachingSessions';
import { MiniCourses } from '@/components/customer/Education';
import { RewardsSystem } from '@/components/customer/RewardsSystem';
import { CondensedRewards } from '@/components/customer/CondensedRewards';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export function CustomerDashboard() {
  const { userData } = useAuth();
  const [isRewardsExpanded, setIsRewardsExpanded] = useState(false);

  return (
    <div className="space-y-6 pb-8">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {userData?.firstName}! 👋
            </h1>
            <p className="text-muted-foreground">
              Track your progress, connect with others, and achieve your goals.
            </p>
          </div>
          {!isRewardsExpanded && (
            <div className="shrink-0">
              <CondensedRewards 
                onExpandChange={setIsRewardsExpanded}
              />
            </div>
          )}
        </div>
      </div>

      <motion.div 
        className="grid gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {isRewardsExpanded && (
          <motion.div
            variants={itemVariants}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <RewardsSystem 
              isExpanded={isRewardsExpanded}
              onExpandChange={setIsRewardsExpanded}
            />
          </motion.div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div variants={itemVariants}>
            <HabitTracker />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <SupportGroups />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <CoachingSessions />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <MiniCourses />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}