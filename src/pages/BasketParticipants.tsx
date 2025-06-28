
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Users, MessageCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ShareButton } from '@/components/ui/share-button';
import { formatCurrency } from '@/lib/formatters';

export const BasketParticipants = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock participants data
  const participants = [
    {
      code: '4B8N2X',
      isOwner: true,
      joinedAt: '2024-01-15',
      contributions: 5
    },
    {
      code: 'M9K3L7',
      isOwner: false,
      joinedAt: '2024-01-16',
      contributions: 3
    },
    {
      code: 'P2Y8Q1',
      isOwner: false,
      joinedAt: '2024-01-17',
      contributions: 7
    },
    {
      code: 'X7V4R9',
      isOwner: false,
      joinedAt: '2024-01-18',
      contributions: 2
    },
    {
      code: 'Z1C6N8',
      isOwner: false,
      joinedAt: '2024-01-19',
      contributions: 4
    }
  ];

  // Sort participants by contributions (highest first)
  const sortedParticipants = [...participants].sort((a, b) => b.contributions - a.contributions);

  // Calculate total contributed amount (mock data - in real app this would come from API)
  const totalContributedAmount = 325000; // This should match the basket's totalContributions

  const basketName = "Lakers Championship Ring Fund"; // Mock basket name
  const basketURL = `${window.location.origin}/basket/${id}`;

  return (
    <div className="min-h-screen bg-gradient-hero pb-24">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <GlassCard variant="subtle" className="flex items-center justify-between mb-6 p-4">
          <div className="flex items-center">
            <EnhancedButton
              onClick={() => navigate(`/basket/${id}`)}
              variant="ghost"
              size="icon"
              className="mr-4 hover:bg-white/10"
            >
              <ArrowLeft className="w-6 h-6" />
            </EnhancedButton>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Participants</h1>
            </div>
          </div>
          
          {/* WhatsApp Share Button */}
          <ShareButton 
            basketName={basketName} 
            basketURL={basketURL} 
            variant="icon"
            size="lg"
            className="hover:bg-white/10 backdrop-blur-sm"
          />
        </GlassCard>

        {/* Stats Card */}
        <GlassCard variant="default" className="p-6 mb-6 animate-scale-in">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold gradient-text">{participants.length}</div>
              <div className="text-sm text-white/70">Total Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold gradient-text">
                {participants.reduce((sum, p) => sum + p.contributions, 0)}
              </div>
              <div className="text-sm text-white/70">Total Contributions</div>
            </div>
            <div>
              <div className="text-2xl font-bold gradient-text">
                {Math.round(participants.reduce((sum, p) => sum + p.contributions, 0) / participants.length)}
              </div>
              <div className="text-sm text-white/70">Avg per Member</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Participants List */}
      <div className="px-4 sm:px-6 space-y-3 sm:space-y-4">
        {sortedParticipants.map((participant, index) => (
          <GlassCard 
            key={participant.code} 
            variant="default" 
            className="p-4 animate-slide-up" 
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {participant.code.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-white">{participant.code}</span>
                    {participant.isOwner && <Crown className="w-4 h-4 text-yellow-400" />}
                    {index === 0 && (
                      <span className="text-xs bg-gradient-accent text-white px-2 py-1 rounded-full font-bold">
                        TOP
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold gradient-text-blue">
                  {formatCurrency(totalContributedAmount)}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Invite Section */}
      <div className="p-4 sm:p-6">
        <GlassCard variant="default" className="p-6 text-center">
          <h3 className="font-semibold mb-2 text-white">Invite More Friends</h3>
          <p className="text-sm text-white/70 mb-4">
            Share your basket link to grow your community
          </p>
          <ShareButton 
            basketName={basketName} 
            basketURL={basketURL} 
            variant="button" 
            size="md" 
            className="mx-auto"
          >
            Share on WhatsApp
          </ShareButton>
        </GlassCard>
      </div>
    </div>
  );
};
