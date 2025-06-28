
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export const useBasketMembership = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinBasket = useCallback(async (basketId: string) => {
    if (!user?.id) {
      throw new Error('User must be authenticated to join a basket');
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('basket_members')
        .insert({
          basket_id: basketId,
          user_id: user.id,
          is_creator: false
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          setError('You are already a member of this basket');
        } else {
          setError('Failed to join basket');
        }
        throw error;
      }

      // Update basket participants count
      const { error: updateError } = await supabase.rpc('increment_basket_participants', {
        basket_id: basketId
      });

      if (updateError) {
        console.error('Failed to update participants count:', updateError);
      }

    } catch (err) {
      console.error('Error joining basket:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const leaveBasket = useCallback(async (basketId: string) => {
    if (!user?.id) {
      throw new Error('User must be authenticated to leave a basket');
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('basket_members')
        .delete()
        .match({
          basket_id: basketId,
          user_id: user.id
        });

      if (error) {
        setError('Failed to leave basket');
        throw error;
      }

      // Update basket participants count
      const { error: updateError } = await supabase.rpc('decrement_basket_participants', {
        basket_id: basketId
      });

      if (updateError) {
        console.error('Failed to update participants count:', updateError);
      }

    } catch (err) {
      console.error('Error leaving basket:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const checkMembership = useCallback(async (basketId: string) => {
    if (!user?.id) return false;

    try {
      const { data, error } = await supabase
        .from('basket_members')
        .select('id')
        .match({
          basket_id: basketId,
          user_id: user.id
        })
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking membership:', error);
        return false;
      }

      return !!data;
    } catch (err) {
      console.error('Error checking basket membership:', err);
      return false;
    }
  }, [user?.id]);

  return {
    joinBasket,
    leaveBasket,
    checkMembership,
    loading,
    error
  };
};
