
import React, { useState, useEffect } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { BasketCard } from '@/components/BasketCard';
import { EmptyState } from '@/components/EmptyState';
import { useNavigate } from 'react-router-dom';
import { useBaskets } from '@/contexts/BasketContext';
import { usePressFeedback } from '@/hooks/useInteractions';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface BasketWithStatus {
  id: string;
  name: string;
  description: string;
  goal: number;
  currentAmount: number;
  progress: number;
  participants: number;
  daysLeft: number;
  isMember: boolean;
  myContribution: number;
  status: 'pending' | 'approved' | 'private';
  isPrivate?: boolean;
}

export const MyBaskets = () => {
  const [activeTab, setActiveTab] = useState('joined');
  const navigate = useNavigate();
  const { getMemberBaskets } = useBaskets();
  const { handlePress } = usePressFeedback();

  // Dummy baskets with status
  const [basketsWithStatus, setBasketsWithStatus] = useState<BasketWithStatus[]>([
    {
      id: '3',
      name: 'Lakers Championship Ring',
      description: 'Supporting our team to get that championship ring!',
      progress: 65,
      goal: 50000,
      currentAmount: 32500,
      participants: 47,
      daysLeft: 10,
      isMember: true,
      myContribution: 15000,
      status: 'approved',
      isPrivate: false
    },
    {
      id: '4',
      name: 'Manchester United Jersey',
      description: 'Getting the new season jersey for the whole squad',
      progress: 80,
      goal: 25000,
      currentAmount: 20000,
      participants: 23,
      daysLeft: 5,
      isMember: true,
      myContribution: 5000,
      status: 'private',
      isPrivate: true
    },
    {
      id: '6',
      name: 'Community Event Fund',
      description: 'Organizing a community sports event for local youth',
      progress: 30,
      goal: 100000,
      currentAmount: 30000,
      participants: 15,
      daysLeft: 20,
      isMember: true,
      myContribution: 10000,
      status: 'pending',
      isPrivate: false
    }
  ]);

  // Auto-approve pending baskets after 5 seconds
  useEffect(() => {
    const pendingBaskets = basketsWithStatus.filter(basket => basket.status === 'pending');
    
    if (pendingBaskets.length > 0) {
      const timer = setTimeout(() => {
        setBasketsWithStatus(prev => 
          prev.map(basket => 
            basket.status === 'pending' 
              ? { ...basket, status: 'approved' as const }
              : basket
          )
        );

        // Show toast for each approved basket
        pendingBaskets.forEach(basket => {
          toast.success(`Your basket '${basket.name}' has been approved!`, {
            description: 'Your basket is now live and accepting contributions',
            duration: 4000,
          });
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [basketsWithStatus]);
  
  const joinedBaskets = basketsWithStatus;
  const createdBaskets: typeof basketsWithStatus = [];

  const baskets = activeTab === 'joined' ? joinedBaskets : createdBaskets;

  const getStatusBadge = (status: 'pending' | 'approved' | 'private') => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs">
            Pending Review
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs">
            Approved
          </Badge>
        );
      case 'private':
        return (
          <Badge className="bg-blue-500 text-white border-0 text-xs">
            Private
          </Badge>
        );
      default:
        return null;
    }
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
            <div key={basket.id} className="relative">
              <BasketCard {...basket} />
              <div className="absolute top-4 right-4 z-10">
                {getStatusBadge(basket.status)}
              </div>
            </div>
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
