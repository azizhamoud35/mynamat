import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ChevronDown, ChevronUp, Goal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CondensedRewardsProps {
  expanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  className?: string;
}

const mockPointsData = {
  total: 2750,
  tier: 'Silver',
  selectedOffer: {
    id: '1',
    name: 'FitLife Gym',
    points: 3000,
    discount: '50%',
    progress: 91.7
  }
};

const getTierInfo = () => {
  const tiers = [
    { name: 'Bronze', threshold: 0, color: 'text-orange-600' },
    { name: 'Silver', threshold: 2500, color: 'text-slate-400' },
    { name: 'Gold', threshold: 5000, color: 'text-yellow-500' },
    { name: 'Platinum', threshold: 10000, color: 'text-slate-600' }
  ];

  const currentTier = tiers.findIndex(t => t.name === mockPointsData.tier);
  const nextTier = tiers[currentTier + 1];
  const prevTier = tiers[currentTier];
  const progress = ((mockPointsData.total - prevTier.threshold) / 
    (nextTier.threshold - prevTier.threshold)) * 100;
  
  return {
    currentTier: tiers[currentTier],
    nextTier,
    progress,
    pointsToNext: nextTier.threshold - mockPointsData.total
  };
};

export function CondensedRewards({ expanded, onExpandChange, className }: CondensedRewardsProps) {
  const [isActuallyExpanded, setIsActuallyExpanded] = useState(expanded);
  const tierInfo = getTierInfo();

  useEffect(() => {
    setIsActuallyExpanded(expanded);
  }, [expanded]);

  const handleExpandToggle = () => {
    setIsActuallyExpanded(!isActuallyExpanded);
    onExpandChange?.(!isActuallyExpanded);
  };

  return (
    <motion.div 
      className={cn("relative", className)}
      layout
      transition={{ duration: 0.2 }}
    >
      <div className="bg-card border rounded-lg p-4">
        <motion.div layout className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="space-y-1">
                <div className="text-2xl font-bold">{mockPointsData.total} points</div>
                <Badge 
                  variant="outline" 
                  className={cn("font-medium", tierInfo.currentTier.color)}
                >
                  <Star className="h-3 w-3 mr-1" />
                  {mockPointsData.tier} Tier
                </Badge>
              </div>
              
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
                      stroke="var(--primary)"
                      strokeWidth="3"
                      strokeDasharray={`${mockPointsData.selectedOffer.progress}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {Math.round(mockPointsData.selectedOffer.progress)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Goal className="h-3 w-3" />
                    Current Goal
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {mockPointsData.selectedOffer.points - mockPointsData.total} points needed
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {mockPointsData.selectedOffer.name} - {mockPointsData.selectedOffer.discount} OFF
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExpandToggle}
            >
              {isActuallyExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}