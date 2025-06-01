
import React from 'react';
import { BasketCard } from '@/components/BasketCard';
import { useBaskets } from '@/contexts/BasketContext';
import { GradientButton } from '@/components/ui/gradient-button';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function Index() {
  const { getNonMemberBaskets } = useBaskets();
  const navigate = useNavigate();
  const availableBaskets = getNonMemberBaskets().slice(0, 3); // Show only first 3

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-12 mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-4">Welcome to IKANISA</h1>
          <p className="text-gray-400 mb-6">Join community baskets and achieve goals together</p>
          <GradientButton
            variant="primary"
            onClick={() => navigate('/create/step/1')}
            className="mr-4"
          >
            <Plus className="w-5 h-5" />
            Create Basket
          </GradientButton>
          <GradientButton
            variant="secondary"
            onClick={() => navigate('/feed')}
          >
            Browse All
          </GradientButton>
        </div>

        {/* Featured Baskets */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Featured Baskets</h2>
          {availableBaskets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No available baskets at the moment</p>
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
    </div>
  );
}
