
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Users } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { toast } from '@/hooks/use-toast';

export const BasketParticipants = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock participants data
  const participants = [
    { code: '4B8N2X', isOwner: true, joinedAt: '2024-01-15', contributions: 5 },
    { code: 'M9K3L7', isOwner: false, joinedAt: '2024-01-16', contributions: 3 },
    { code: 'P2Y8Q1', isOwner: false, joinedAt: '2024-01-17', contributions: 7 },
    { code: 'X7V4R9', isOwner: false, joinedAt: '2024-01-18', contributions: 2 },
    { code: 'Z1C6N8', isOwner: false, joinedAt: '2024-01-19', contributions: 4 },
  ];

  // Calculate total contributed amount (mock data - in real app this would come from API)
  const totalContributedAmount = 32500; // This should match the basket's totalContributions

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: `Code ${code} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Participants</h1>
            <div className="flex items-center gap-1 text-gray-400">
              <Users className="w-4 h-4" />
              <span>{participants.length} members</span>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <GlassCard className="p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold gradient-text">{participants.length}</div>
              <div className="text-sm text-gray-400">Total Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold gradient-text">
                {participants.reduce((sum, p) => sum + p.contributions, 0)}
              </div>
              <div className="text-sm text-gray-400">Total Contributions</div>
            </div>
            <div>
              <div className="text-2xl font-bold gradient-text">
                {Math.round(participants.reduce((sum, p) => sum + p.contributions, 0) / participants.length)}
              </div>
              <div className="text-sm text-gray-400">Avg per Member</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Participants List */}
      <div className="px-6 space-y-3">
        {participants.map((participant, index) => (
          <GlassCard key={participant.code} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-purple-pink flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {participant.code.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold">{participant.code}</span>
                    {participant.isOwner && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold gradient-text">
                  RWF {totalContributedAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Invite Section */}
      <div className="p-6">
        <GlassCard className="p-4 text-center">
          <h3 className="font-semibold mb-2">Invite More Friends</h3>
          <p className="text-sm text-gray-400 mb-4">
            Share your basket code to grow your community
          </p>
          <button className="text-pink-400 font-medium hover:text-pink-300 transition-colors">
            Share Basket Code
          </button>
        </GlassCard>
      </div>
    </div>
  );
};
