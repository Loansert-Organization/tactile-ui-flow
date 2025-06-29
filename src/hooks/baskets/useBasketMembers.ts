import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { BasketMember, MemberStats, MemberInvitation } from './types';
import { toast } from 'sonner';

export const useBasketMembers = (basketId?: string) => {
  const { user } = useAuthContext();
  const [members, setMembers] = useState<BasketMember[]>([]);
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async (basketId: string) => {
    if (!basketId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('basket_members')
        .select(`
          id,
          basket_id,
          user_id,
          joined_at,
          is_creator,
          users!inner(
            id,
            display_name,
            avatar_url,
            country,
            phone_number,
            role
          )
        `)
        .eq('basket_id', basketId)
        .order('is_creator', { ascending: false })
        .order('joined_at', { ascending: true });

      if (error) throw error;

      // Fetch contribution stats for each member
      const membersWithContributions = await Promise.all(
        (data || []).map(async (member) => {
          const { data: contributionStats, error: statsError } = await supabase
            .from('contributions')
            .select('amount_local, amount_usd, created_at')
            .eq('basket_id', basketId)
            .eq('user_id', member.user_id)
            .eq('confirmed', true);

          if (statsError) {
            console.error('Error fetching contribution stats:', statsError);
          }

          const contributions = contributionStats || [];
          return {
            ...member,
            contributions: {
              count: contributions.length,
              total_amount_local: contributions.reduce((sum, c) => sum + c.amount_local, 0),
              total_amount_usd: contributions.reduce((sum, c) => sum + c.amount_usd, 0),
              latest_contribution_at: contributions.length > 0 
                ? contributions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
                : undefined
            }
          };
        })
      );

      setMembers(membersWithContributions);

      // Calculate stats
      const totalMembers = membersWithContributions.length;
      const totalContributions = membersWithContributions.reduce((sum, m) => sum + m.contributions.count, 0);
      const averageContribution = totalContributions > 0 
        ? membersWithContributions.reduce((sum, m) => sum + m.contributions.total_amount_usd, 0) / totalContributions
        : 0;

      const topContributor = membersWithContributions.length > 0
        ? membersWithContributions.reduce((prev, current) => 
            prev.contributions.total_amount_usd > current.contributions.total_amount_usd ? prev : current
          )
        : null;

      const recentMembers = membersWithContributions
        .sort((a, b) => new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime())
        .slice(0, 5);

      setStats({
        total_members: totalMembers,
        total_contributions: totalContributions,
        average_contribution: averageContribution,
        top_contributor: topContributor,
        recent_members: recentMembers
      });

    } catch (err: any) {
      console.error('[BASKET_MEMBERS] Fetch error:', err);
      setError(err.message || 'Failed to load basket members');
    } finally {
      setLoading(false);
    }
  }, []);

  const addMember = useCallback(async (basketId: string, userId: string) => {
    if (!user?.id) {
      throw new Error('User must be authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('basket_members')
        .insert({
          basket_id: basketId,
          user_id: userId,
          is_creator: false
        });

      if (error) {
        if (error.code === '23505') {
          throw new Error('User is already a member of this basket');
        }
        throw error;
      }

      // Refresh members list
      await fetchMembers(basketId);
      toast.success('Member added successfully');

    } catch (err: any) {
      console.error('[BASKET_MEMBERS] Add member error:', err);
      setError(err.message || 'Failed to add member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id, fetchMembers]);

  const removeMember = useCallback(async (basketId: string, userId: string) => {
    if (!user?.id) {
      throw new Error('User must be authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      // Check if current user is creator or admin
      const { data: basket, error: basketError } = await supabase
        .from('baskets')
        .select('creator_id')
        .eq('id', basketId)
        .single();

      if (basketError) throw basketError;

      const isCreator = basket.creator_id === user.id;
      const isAdmin = user.role === 'admin';

      if (!isCreator && !isAdmin && userId !== user.id) {
        throw new Error('You do not have permission to remove this member');
      }

      const { error } = await supabase
        .from('basket_members')
        .delete()
        .match({
          basket_id: basketId,
          user_id: userId
        });

      if (error) throw error;

      // Refresh members list
      await fetchMembers(basketId);
      toast.success('Member removed successfully');

    } catch (err: any) {
      console.error('[BASKET_MEMBERS] Remove member error:', err);
      setError(err.message || 'Failed to remove member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id, fetchMembers]);

  const inviteMember = useCallback(async (basketId: string, invitation: MemberInvitation) => {
    if (!user?.id) {
      throw new Error('User must be authenticated');
    }

    try {
      // Check if user with phone number exists
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('phone_number', invitation.phone_number)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      if (existingUser) {
        // User exists, add them directly
        await addMember(basketId, existingUser.id);
      } else {
        // User doesn't exist, create invitation link
        const { data: basket, error: basketError } = await supabase
          .from('baskets')
          .select('name')
          .eq('id', basketId)
          .single();

        if (basketError) throw basketError;

        const inviteUrl = `${window.location.origin}/basket/${basketId}/join`;
        const message = invitation.message || 
          `You've been invited to join "${basket.name}" basket. Click here to join: ${inviteUrl}`;

        // In a real app, you would send SMS here
        // For now, we'll just copy to clipboard or show a shareable link
        if (navigator.share) {
          await navigator.share({
            title: `Invitation to ${basket.name}`,
            text: message,
            url: inviteUrl
          });
        } else {
          await navigator.clipboard.writeText(message);
          toast.success('Invitation link copied to clipboard');
        }
      }

    } catch (err: any) {
      console.error('[BASKET_MEMBERS] Invite member error:', err);
      setError(err.message || 'Failed to invite member');
      throw err;
    }
  }, [user?.id, addMember]);

  const checkIfUserIsMember = useCallback(async (basketId: string, userId?: string) => {
    const checkUserId = userId || user?.id;
    if (!checkUserId) return false;

    try {
      const { data, error } = await supabase
        .from('basket_members')
        .select('id, is_creator')
        .match({
          basket_id: basketId,
          user_id: checkUserId
        })
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking membership:', error);
        return false;
      }

      return data ? { isMember: true, isCreator: data.is_creator } : { isMember: false, isCreator: false };
    } catch (err) {
      console.error('Error checking membership:', err);
      return { isMember: false, isCreator: false };
    }
  }, [user?.id]);

  // Auto-fetch members when basketId changes
  useEffect(() => {
    if (basketId) {
      fetchMembers(basketId);
    }
  }, [basketId, fetchMembers]);

  return {
    members,
    stats,
    loading,
    error,
    fetchMembers,
    addMember,
    removeMember,
    inviteMember,
    checkIfUserIsMember
  };
}; 