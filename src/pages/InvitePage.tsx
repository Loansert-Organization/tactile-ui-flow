
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Target, Calendar } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { usePressFeedback } from '@/hooks/useInteractions';
import { toast } from 'sonner';

interface BasketInfo {
  id: string;
  name: string;
  description: string;
  goal: number;
  totalContributed: number;
  memberCount: number;
  frequency: string;
  isValid: boolean;
}

const InvitePage = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { handlePress } = usePressFeedback();
  const [basketInfo, setBasketInfo] = useState<BasketInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch basket info
    const fetchBasketInfo = () => {
      setTimeout(() => {
        if (code === '123456') {
          setBasketInfo({
            id: '1',
            name: 'Holiday Savings Group',
            description: 'Save together for our dream vacation to Zanzibar! Join us in building memories that will last a lifetime.',
            goal: 2000000,
            totalContributed: 850000,
            memberCount: 8,
            frequency: 'monthly',
            isValid: true
          });
        } else {
          setBasketInfo({ 
            id: '', 
            name: '', 
            description: '', 
            goal: 0, 
            totalContributed: 0, 
            memberCount: 0, 
            frequency: '', 
            isValid: false 
          });
        }
        setIsLoading(false);
      }, 1000);
    };

    fetchBasketInfo();
  }, [code]);

  const handleJoin = async () => {
    setIsJoining(true);
    
    // Simulate joining process
    setTimeout(() => {
      toast.success('Successfully joined the basket!');
      navigate('/basket/1');
      setIsJoining(false);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
        <GlassCard className="max-w-md mx-auto p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full mx-auto mb-4" />
          <p className="text-gray-300">Loading basket information...</p>
        </GlassCard>
      </div>
    );
  }

  if (!basketInfo?.isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
        <GlassCard className="max-w-md mx-auto p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-400 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-red-400 mb-2">Invalid Invitation</h2>
          <p className="text-gray-400 mb-6">
            This invitation code is not valid or has expired.
          </p>
          <GradientButton onClick={() => navigate('/')} className="w-full">
            Go to Home
          </GradientButton>
        </GlassCard>
      </div>
    );
  }

  const progressPercentage = (basketInfo.totalContributed / basketInfo.goal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-md mx-auto pt-20">
        <GlassCard className="p-6 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold gradient-text mb-2">
              You're Invited!
            </h1>
            <p className="text-gray-400">Join this amazing savings group</p>
          </div>

          <div className="space-y-6">
            {/* Basket Info */}
            <div>
              <h2 className="text-xl font-bold text-white mb-2">{basketInfo.name}</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {basketInfo.description}
              </p>
            </div>

            {/* Progress Badge */}
            <div className="bg-gradient-magenta-orange/20 p-4 rounded-xl border border-orange-500/30">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Progress</span>
                <span className="text-sm font-medium text-orange-300">
                  {progressPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-magenta-orange h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">
                  RWF {basketInfo.totalContributed.toLocaleString()}
                </span>
                <span className="text-gray-400">
                  RWF {basketInfo.goal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-teal-blue/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-teal-300" />
                </div>
                <p className="text-xs text-gray-400">Members</p>
                <p className="font-bold text-white">{basketInfo.memberCount}</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-purple-pink/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-purple-300" />
                </div>
                <p className="text-xs text-gray-400">Goal</p>
                <p className="font-bold text-white">RWF {(basketInfo.goal / 1000).toFixed(0)}K</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-magenta-orange/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-6 h-6 text-orange-300" />
                </div>
                <p className="text-xs text-gray-400">Frequency</p>
                <p className="font-bold text-white capitalize">{basketInfo.frequency}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GradientButton
          onClick={(e) => { handlePress(e); handleJoin(); }}
          className="w-full"
          size="lg"
          loading={isJoining}
        >
          {isJoining ? 'Joining...' : 'Join This Basket'}
        </GradientButton>

        <p className="text-center text-xs text-gray-500 mt-4">
          By joining, you agree to the contribution schedule and group rules
        </p>
      </div>
    </div>
  );
};

export default InvitePage;
