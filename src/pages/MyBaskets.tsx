
import React, { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Lock } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { BasketCard } from '@/components/BasketCard';
import { EmptyState } from '@/components/EmptyState';
import { useNavigate } from 'react-router-dom';
import { usePressFeedback } from '@/hooks/useInteractions';
import { Badge } from '@/components/ui/badge';
import { useMyBasketsContext } from '@/contexts/MyBasketsContext';

export const MyBaskets = () => {
  const [activeTab, setActiveTab] = useState('joined');
  const navigate = useNavigate();
  const { handlePress } = usePressFeedback();
  const { myBaskets } = useMyBasketsContext();

  // For demo purposes, all baskets are "joined" 
  const joinedBaskets = myBaskets;
  const createdBaskets = myBaskets.filter(basket => basket.isPrivate);

  const baskets = activeTab === 'joined' ? joinedBaskets : createdBaskets;

  const getStatusBadge = (basket: any) => {
    // All user-created baskets are private, no pending review needed
    return (
      <Badge className="bg-blue-500 text-white border-0 p-2 rounded-full">
        <Lock className="w-4 h-4" />
      </Badge>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                handlePress(e);
                navigate('/');
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors focus-gradient"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold gradient-text">My Baskets</h1>
          </div>
        </div>

        {/* Tabs */}
        <GlassCard className="p-1 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setActiveTab('joined')}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'joined'
                  ? 'bg-gradient-magenta-orange text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={{ minHeight: '44px' }}
            >
              Joined ({joinedBaskets.length})
            </button>
            <button
              onClick={() => setActiveTab('created')}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'created'
                  ? 'bg-gradient-magenta-orange text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={{ minHeight: '44px' }}
            >
              Created ({createdBaskets.length})
            </button>
          </div>
        </GlassCard>

        {/* Create New Basket Button */}
        <GradientButton
          variant="primary"
          className="w-full mb-6 flex items-center justify-center gap-2"
          onClick={() => navigate('/create/step/1')}
          style={{ minHeight: '44px' }}
        >
          <Plus className="w-5 h-5" />
          Create New Private Basket
        </GradientButton>
      </div>

      {/* ARIA live region for basket updates */}
      <div className="sr-only" aria-live="polite" id="basket-announcements" />

      {/* Baskets List */}
      <div className="px-6 space-y-4">
        {baskets.length > 0 ? (
          baskets.map((basket, index) => (
            <div 
              key={basket.id} 
              className="relative animate-slide-up" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BasketCard 
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
              <div className="absolute top-2 right-2 z-10">
                {getStatusBadge(basket)}
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title={activeTab === 'joined' ? "No Baskets Joined" : "No Baskets Created"}
            description={
              activeTab === 'joined'
                ? "Join your first basket by browsing public baskets on the home screen"
                : "Create your first private basket to start collecting funds for your goal"
            }
            actionLabel={activeTab === 'joined' ? "Browse Public Baskets" : "Create Private Basket"}
            onAction={() => navigate(activeTab === 'joined' ? '/' : '/create/step/1')}
            icon={<Plus className="w-8 h-8" />}
          />
        )}
      </div>
    </div>
  );
};
