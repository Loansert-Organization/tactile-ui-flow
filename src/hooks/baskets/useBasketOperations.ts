
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreateBasketData, MyBasket } from './types';

export const useBasketOperations = (user: any) => {
  const createBasket = useCallback(async (basketData: CreateBasketData): Promise<MyBasket> => {
    if (!user?.id) {
      throw new Error('User must be authenticated to create a basket');
    }

    try {
      // Create the basket
      const { data: basket, error: basketError } = await supabase
        .from('baskets')
        .insert({
          title: basketData.title,
          description: basketData.description,
          goal_amount: basketData.goalAmount,
          creator_id: user.id,
          country: basketData.country || 'RW',
          currency: basketData.currency || 'RWF',
          category: basketData.category,
          is_private: basketData.isPrivate || false,
          duration_days: basketData.durationDays || 30
        })
        .select()
        .single();

      if (basketError) {
        console.error('Error creating basket:', basketError);
        throw basketError;
      }

      // Add creator as a member
      const { error: memberError } = await supabase
        .from('basket_members')
        .insert({
          basket_id: basket.id,
          user_id: user.id,
          is_creator: true
        });

      if (memberError) {
        console.error('Error adding creator as member:', memberError);
        // Don't throw here as basket is already created
      }

      return {
        id: basket.id,
        title: basket.title,
        description: basket.description,
        goalAmount: basket.goal_amount,
        currentAmount: basket.current_amount || 0,
        participantsCount: basket.participants_count || 1,
        createdAt: basket.created_at,
        country: basket.country,
        currency: basket.currency,
        category: basket.category,
        isPrivate: basket.is_private,
        durationDays: basket.duration_days,
        creatorId: basket.creator_id,
        isCreator: true
      };
    } catch (error) {
      console.error('Error in createBasket:', error);
      throw error;
    }
  }, [user?.id]);

  const updateBasket = useCallback(async (id: string, updates: Partial<MyBasket>) => {
    if (!user?.id) {
      throw new Error('User must be authenticated to update a basket');
    }

    try {
      const { error } = await supabase
        .from('baskets')
        .update({
          title: updates.title,
          description: updates.description,
          goal_amount: updates.goalAmount,
          is_private: updates.isPrivate,
          category: updates.category
        })
        .eq('id', id)
        .eq('creator_id', user.id); // Ensure only creator can update

      if (error) {
        console.error('Error updating basket:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateBasket:', error);
      throw error;
    }
  }, [user?.id]);

  const deleteBasket = useCallback(async (id: string) => {
    if (!user?.id) {
      throw new Error('User must be authenticated to delete a basket');
    }

    try {
      const { error } = await supabase
        .from('baskets')
        .delete()
        .eq('id', id)
        .eq('creator_id', user.id); // Ensure only creator can delete

      if (error) {
        console.error('Error deleting basket:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteBasket:', error);
      throw error;
    }
  }, [user?.id]);

  return {
    createBasket,
    updateBasket,
    deleteBasket
  };
};
