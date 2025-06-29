import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Users, UserPlus, BarChart3, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { ShareButton } from '@/components/ui/share-button';
import { MemberCard } from '@/components/basket/MemberCard';
import { InviteMemberModal } from '@/components/basket/InviteMemberModal';
import { useBasketMembers } from '@/hooks/baskets/useBasketMembers';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/formatters';
import { toast } from 'sonner';

interface BasketInfo {
  id: string;
  name: string;
  creator_id: string;
  is_private: boolean;
  current_amount: number;
  goal_amount: number;
  currency: string;
}

export const BasketParticipants = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [basket, setBasket] = useState<BasketInfo | null>(null);
  const [basketLoading, setBasketLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [userMembership, setUserMembership] = useState({ isMember: false, isCreator: false });

  const {
    members,
    stats,
    loading,
    error,
    fetchMembers,
    removeMember,
    inviteMember,
    checkIfUserIsMember
  } = useBasketMembers(id);

  // Fetch basket information
  useEffect(() => {
    const fetchBasket = async () => {
      if (!id) return;

      try {
        setBasketLoading(true);
        const { data, error } = await supabase
          .from('baskets')
          .select('id, name, creator_id, is_private, current_amount, goal_amount, currency')
          .eq('id', id)
          .single();

        if (error) throw error;
        setBasket(data);

        // Check user membership
        if (user?.id) {
          const membership = await checkIfUserIsMember(id, user.id);
          setUserMembership(membership);
        }
      } catch (err: any) {
        console.error('[BASKET_PARTICIPANTS] Fetch basket error:', err);
        toast.error('Failed to load basket information');
        navigate('/');
      } finally {
        setBasketLoading(false);
      }
    };

    fetchBasket();
  }, [id, user?.id, navigate, checkIfUserIsMember]);

  const handleRemoveMember = async (userId: string) => {
    if (!id) return;
    await removeMember(id, userId);
  };

  const handleInviteMember = async (invitation: any) => {
    if (!id) return;
    await inviteMember(id, invitation);
  };

  // Sort members by contribution amount (descending)
  const sortedMembers = members.sort((a, b) => {
    // Creators first, then by contribution amount
    if (a.is_creator && !b.is_creator) return -1;
    if (!a.is_creator && b.is_creator) return 1;
    return b.contributions.total_amount_usd - a.contributions.total_amount_usd;
  });

  const basketURL = `${window.location.origin}/basket/${id}`;
  const canManageMembers = userMembership.isCreator || user?.role === 'admin';

  if (basketLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="p-6">Loading basket information...</GlassCard>
      </div>
    );
  }

  if (!basket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="p-6">Basket not found</GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(`/basket/${id}`)} 
              className="p-2 rounded-lg hover:bg-white/10 transition-colors mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Members</h1>
              <p className="text-sm text-muted-foreground">{basket.name}</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {canManageMembers && (
              <Button
                onClick={() => setShowInviteModal(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Invite
              </Button>
            )}
            
            <ShareButton 
              basketName={basket.name} 
              basketURL={basketURL} 
              variant="icon"
              size="lg"
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <GlassCard className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold gradient-text">{stats?.total_members || 0}</div>
            <div className="text-sm text-gray-400">Total Members</div>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold gradient-text">{stats?.total_contributions || 0}</div>
            <div className="text-sm text-gray-400">Total Contributions</div>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold gradient-text">
              {formatCurrency(stats?.average_contribution || 0)}
            </div>
            <div className="text-sm text-gray-400">Avg Contribution</div>
          </GlassCard>

          <GlassCard className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold gradient-text">
              {stats?.top_contributor ? formatCurrency(stats.top_contributor.contributions.total_amount_usd) : '$0'}
            </div>
            <div className="text-sm text-gray-400">Top Contributor</div>
          </GlassCard>
        </div>
      </div>

      {/* Members List */}
      <div className="px-6 space-y-3">
        {loading ? (
          <GlassCard className="p-6 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full mx-auto mb-2"></div>
            Loading members...
          </GlassCard>
        ) : error ? (
          <GlassCard className="p-6 text-center text-red-400">
            Error loading members: {error}
            <Button 
              onClick={() => fetchMembers(id!)} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Retry
            </Button>
          </GlassCard>
        ) : sortedMembers.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No members yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to join this basket or invite friends to get started.
            </p>
            {canManageMembers && (
              <Button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Invite Members
              </Button>
            )}
          </GlassCard>
        ) : (
          sortedMembers.map((member, index) => (
            <MemberCard
              key={member.id}
              member={member}
              isCreator={userMembership.isCreator}
              canManageMembers={canManageMembers}
              rank={index + 1}
              onRemoveMember={handleRemoveMember}
              loading={loading}
            />
          ))
        )}
      </div>

      {/* Invite Section */}
      {!loading && members.length > 0 && (
        <div className="p-6">
          <GlassCard className="p-4 text-center">
            <h3 className="font-semibold mb-2">Grow Your Community</h3>
            <p className="text-sm text-gray-400 mb-4">
              Invite more friends to join and contribute to this basket
            </p>
            <div className="flex gap-2 justify-center">
              {canManageMembers && (
                <Button
                  onClick={() => setShowInviteModal(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite Members
                </Button>
              )}
              <ShareButton 
                basketName={basket.name} 
                basketURL={basketURL} 
                variant="button" 
                size="md"
                className="flex items-center gap-2"
              >
                Share Basket
              </ShareButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        basketName={basket.name}
        basketId={basket.id}
        onInvite={handleInviteMember}
        loading={loading}
      />
    </div>
  );
};
