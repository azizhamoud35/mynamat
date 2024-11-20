import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Star, ShoppingBag, Trophy, Sparkles, MapPin, Goal, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RewardsSystemProps {
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

export function RewardsSystem({ isExpanded, onExpandChange }: RewardsSystemProps) {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>('1');

  const pointsData = {
    total: 2750,
    nextTier: 5000,
    tier: 'Silver',
    history: [
      { source: 'Habit Streak', points: 100, date: '2024-03-15' },
      { source: 'Course Completion', points: 500, date: '2024-03-14' },
      { source: 'Group Participation', points: 50, date: '2024-03-13' },
      { source: 'Session Attendance', points: 200, date: '2024-03-12' },
    ],
    selectedOffer: {
      id: '1',
      name: 'FitLife Gym',
      points: 3000,
      discount: '50%',
      progress: 91.7
    },
    partnerRewards: [
      {
        id: '1',
        name: 'FitLife Gym',
        description: '50% off 3-month membership',
        points: 3000,
        category: 'Fitness',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=200&fit=crop',
        discount: '50%'
      },
      {
        id: '2',
        name: 'Green Kitchen',
        description: '30% off healthy meal plans',
        points: 2000,
        category: 'Nutrition',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop',
        discount: '30%'
      },
      {
        id: '3',
        name: 'Zen Spa',
        description: 'Free massage session',
        points: 5000,
        category: 'Wellness',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=200&fit=crop',
        discount: 'FREE'
      },
      {
        id: '4',
        name: 'SportStyle',
        description: '25% off athletic wear',
        points: 1500,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=300&h=200&fit=crop',
        discount: '25%'
      }
    ]
  };

  const tiers = [
    { name: 'Bronze', threshold: 0, color: 'bg-orange-600' },
    { name: 'Silver', threshold: 2500, color: 'bg-slate-400' },
    { name: 'Gold', threshold: 5000, color: 'bg-yellow-500' },
    { name: 'Platinum', threshold: 10000, color: 'bg-slate-600' }
  ];

  const currentTierProgress = () => {
    const currentTier = tiers.findIndex(t => t.name === pointsData.tier);
    const nextTier = tiers[currentTier + 1];
    const prevTier = tiers[currentTier];
    const progress = ((pointsData.total - prevTier.threshold) / 
      (nextTier.threshold - prevTier.threshold)) * 100;
    return Math.round(progress);
  };

  const handleSetGoal = (rewardId: string) => {
    const reward = pointsData.partnerRewards.find(r => r.id === rewardId);
    if (!reward) return;

    setSelectedGoalId(rewardId);
    toast.success(`Set "${reward.name}" as your points goal!`);
  };

  const handleExpandToggle = () => {
    onExpandChange?.(!isExpanded);
  };

  const selectedReward = pointsData.partnerRewards.find(r => r.id === selectedGoalId);
  const rewardProgress = selectedReward ? (pointsData.total / selectedReward.points) * 100 : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#7dda55]" />
              Partner Rewards
            </CardTitle>

            {isExpanded && (
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#7dda55"
                      strokeWidth="3"
                      strokeDasharray={`${rewardProgress}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {Math.round(rewardProgress)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Goal className="h-3 w-3" />
                    Current Goal
                  </div>
                  {selectedReward && (
                    <>
                      <div className="text-xs text-muted-foreground">
                        {selectedReward.points - pointsData.total} points needed
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {selectedReward.name} - {selectedReward.discount} OFF
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Find Partners
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExpandToggle}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-2xl font-bold">{pointsData.total} points</div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={cn("font-medium", {
                      'border-yellow-500 text-yellow-500': pointsData.tier === 'Gold',
                      'border-slate-400 text-slate-400': pointsData.tier === 'Silver',
                      'border-slate-600 text-slate-600': pointsData.tier === 'Platinum',
                      'border-orange-600 text-orange-600': pointsData.tier === 'Bronze'
                    })}
                  >
                    <Star className="h-3 w-3 mr-1" />
                    {pointsData.tier} Tier
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {pointsData.nextTier - pointsData.total} points to next tier
                  </span>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <ShoppingBag className="h-4 w-4 mr-2" />
                View Card
              </Button>
            </div>
            <Progress value={currentTierProgress()} className="h-2 mt-4" />
          </motion.div>
        )}
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-6 grid gap-6 grid-cols-[2fr_1fr]">
          {/* Partner Rewards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Partner Offers</h3>
              <div className="flex gap-2">
                <Badge variant="outline">All Categories</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {pointsData.partnerRewards.map((reward) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "group relative overflow-hidden rounded-lg border bg-card transition-colors hover:bg-muted/50",
                    selectedGoalId === reward.id && "ring-2 ring-[#7dda55]"
                  )}
                >
                  <div className="aspect-[3/2] overflow-hidden">
                    <img 
                      src={reward.image} 
                      alt={reward.name}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">
                        {reward.category}
                      </Badge>
                      <Badge variant="outline" className="font-bold">
                        {reward.discount}
                      </Badge>
                    </div>
                    <h4 className="font-semibold mb-1">{reward.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {reward.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {reward.points} points
                      </span>
                      <Button
                        size="sm"
                        variant={selectedGoalId === reward.id ? "default" : "outline"}
                        onClick={() => handleSetGoal(reward.id)}
                        className={selectedGoalId === reward.id ? "bg-[#7dda55] hover:bg-[#6dc447] text-white" : ""}
                      >
                        {selectedGoalId === reward.id ? (
                          <>
                            <Goal className="h-4 w-4 mr-2" />
                            Current Goal
                          </>
                        ) : (
                          <>
                            <Gift className="h-4 w-4 mr-2" />
                            Set as Goal
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Points History */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Recent Activity
            </h3>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {pointsData.history.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{item.source}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.date}
                      </div>
                    </div>
                    <Badge variant="secondary" className="font-medium">
                      +{item.points}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      )}
    </Card>
  );
}