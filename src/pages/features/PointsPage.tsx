import { useState } from 'react';
import { RewardsSystem } from '@/components/customer/RewardsSystem';

export function PointsPage() {
  const [isRewardsExpanded, setIsRewardsExpanded] = useState(true);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Points & Rewards</h1>
        <p className="text-muted-foreground">
          Track your progress and redeem rewards from our partners.
        </p>
      </div>

      <RewardsSystem 
        isExpanded={isRewardsExpanded}
        onExpandChange={setIsRewardsExpanded}
      />
    </div>
  );
}