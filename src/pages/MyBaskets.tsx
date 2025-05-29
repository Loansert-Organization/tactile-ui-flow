
import React, { useState } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { BasketCard } from '@/components/BasketCard';
import { EmptyState } from '@/components/EmptyState';
import { useNavigate } from 'react-router-dom';
import { useBaskets } from '@/contexts/BasketContext';
import { usePressFeedback } from '@/hooks/useInteractions';

export const MyBaskets = () => {
  const [activeTab, setActiveTab] = useState('joined');
  const navigate = useNavigate();
  const { getMemberBaskets } = useBaskets();
  const { handlePress } = usePressFeedback();

  const memberBaskets = getMemberBaskets();
  
  // For now, we'll treat all member baskets as "joined" since we don't have ownership tracking
  const joinedBaskets = memberBaskets;
  const createdBaskets: typeof memberBaskets = []; // Empty for now

  const baskets = activeTab === 'joined' ? joinedBaskets : createdBaskets;

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
        >
          <Plus className="w-5 h-5" />
          Create New Basket
        </GradientButton>
      </div>

      {/* Baskets List */}
      <div className="px-6 space-y-4">
        {baskets.length > 0 ? (
          baskets.map((basket) => (
            <BasketCard key={basket.id} {...basket} />
          ))
        ) : (
          <EmptyState
            title={activeTab === 'joined' ? "No Baskets Joined" : "No Baskets Created"}
            description={
              activeTab === 'joined'
                ? "Join your first basket by browsing public baskets on the home screen"
                : "Create your first basket to start collecting funds for your goal"
            }
            actionLabel={activeTab === 'joined' ? "Browse Public Baskets" : "Create Basket"}
            onAction={() => navigate(activeTab === 'joined' ? '/' : '/create/step/1')}
            icon={<Plus className="w-8 h-8" />}
          />
        )}
      </div>
    </div>
  );
};
