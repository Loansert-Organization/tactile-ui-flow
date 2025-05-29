
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Target, Calendar, ExternalLink } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Skeleton } from '@/components/ui/skeleton';

export const InviteLanding = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [basket, setBasket] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch basket details
    const timer = setTimeout(() => {
      if (code === '1' || code === 'BASKET') {
        setBasket({
          id: '1',
          name: 'Lakers Championship Ring Fund',
          description: 'Supporting our team to get that championship ring! Every contribution counts towards our goal.',
          goal: 50000,
          currentAmount: 32500,
          participants: 47,
          progress: 65,
          daysLeft: 45
        });
      } else {
        setError(true);
      }
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [code]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
        <GlassCard className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <Skeleton className="w-16 h-16 rounded-xl mx-auto mb-4" />
            <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </GlassCard>
      </div>
    );
  }

  if (error || !basket) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
        <GlassCard className="w-full max-w-md p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">Basket Not Found</h2>
          <p className="text-gray-400 mb-6">
            The basket you're looking for doesn't exist or has been removed.
          </p>
          <GradientButton
            variant="primary"
            onClick={() => navigate('/')}
          >
            Browse Public Baskets
          </GradientButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold gradient-text mb-2">You're Invited!</h1>
          <p className="text-gray-300">Join this basket and start contributing</p>
        </div>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-purple-pink flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {basket.name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold gradient-text">{basket.name}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{basket.participants} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{basket.daysLeft} days left</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-300 mb-6">{basket.description}</p>

          {/* Progress */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Progress</span>
              <span className="font-semibold gradient-text-blue">{basket.progress}%</span>
            </div>
            
            <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-teal-blue rounded-full"
                style={{ width: `${basket.progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">RWF {basket.currentAmount.toLocaleString()}</span>
              <div className="flex items-center gap-1 text-gray-400">
                <Target className="w-4 h-4" />
                <span>RWF {basket.goal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <GradientButton
            variant="primary"
            className="w-full mb-3"
            onClick={() => navigate(`/basket/${basket.id}`)}
          >
            Join This Basket
          </GradientButton>

          <button
            onClick={() => navigate(`/basket/${basket.id}`)}
            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Details
          </button>
        </GlassCard>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Browse other public baskets
          </button>
        </div>
      </div>
    </div>
  );
};
