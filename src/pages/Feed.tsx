
import React from 'react';
import { BasketCard } from '@/components/BasketCard';
import { useBaskets } from '@/contexts/BasketContext';

export default function Feed() {
  const { getNonMemberBaskets } = useBaskets();
  const availableBaskets = getNonMemberBaskets();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold gradient-text mb-6">Discover Baskets</h1>
        
        {availableBaskets.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No Available Baskets</h2>
            <p className="text-gray-400">Check back later for new opportunities to join!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {availableBaskets.map((basket) => (
              <BasketCard
                key={basket.id}
                id={basket.id}
                name={basket.name}
                description={basket.description}
                isPrivate={basket.isPrivate}
                progress={basket.progress}
                goal={basket.goal}
                currentAmount={basket.currentAmount}
                participants={basket.participants}
                isMember={basket.isMember}
                myContribution={basket.myContribution}
                daysLeft={basket.daysLeft}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
