
import React, { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Lock, Globe } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { BasketCard } from '@/components/BasketCard';
import { EmptyState } from '@/components/EmptyState';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePressFeedback } from '@/hooks/useInteractions';
import { Badge } from '@/components/ui/badge';
import { useMyBasketsContext } from '@/contexts/MyBasketsContext';

export const MyBaskets = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'joined';
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();
  const { handlePress } = usePressFeedback();
  const { myBaskets } = useMyBasketsContext();

  // Update tab when URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && (tabFromUrl === 'joined' || tabFromUrl === 'created')) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // For demo purposes, all baskets are "joined" 
  const joinedBaskets = myBaskets;
  const createdBaskets = myBaskets.filter(basket => basket.isPrivate);
  const baskets = activeTab === 'joined' ? joinedBaskets : createdBaskets;

  const getStatusBadge = (basket: any) => {
    if (basket.isPrivate) {
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 backdrop-blur-sm">
          <Lock className="w-4 h-4" />
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-sm">
          <Globe className="w-4 h-4" />
        </Badge>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <EnhancedButton
              onClick={(e) => {
                handlePress(e);
                navigate('/');
              }}
              variant="ghost"
              size="icon"
              className="hover:bg-white/10 backdrop-blur-sm"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </EnhancedButton>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">My Baskets</h1>
          </div>
          
          {/* Plus Icon Button */}
          <EnhancedButton
            onClick={(e) => {
              handlePress(e);
              navigate('/baskets/new');
            }}
            variant="glass"
            size="icon"
            className="shadow-glass-md"
            aria-label="Create New Basket"
          >
            <Plus className="w-6 h-6" />
          </EnhancedButton>
        </div>
      </div>

      {/* ARIA live region for basket updates */}
      <div className="sr-only" aria-live="polite" id="basket-announcements" />

      {/* Baskets List */}
      <div className="px-4 sm:px-6 space-y-4 sm:space-y-6">
        {baskets.length > 0 ? (
          baskets.map((basket, index) => (
            <div
              key={basket.id}
              className="relative animate-slide-up will-change-transform"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BasketCard
                id={basket.id}
                name={basket.name}
                description={basket.description}
                privacy={basket.isPrivate ? 'private' : 'public'}
                progress={basket.progress}
                goal={basket.goal}
                currentAmount={basket.currentAmount}
                participants={basket.participants}
                isMember={basket.isMember}
                myContribution={basket.myContribution}
                daysLeft={basket.daysLeft}
                showOnHomeScreen={false}
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
