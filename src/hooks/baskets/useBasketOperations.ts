
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreateBasketData, MyBasket } from './types';
import { transformBasketFromDb, transformBasketToDb } from './basketTransformers';

export const useBasketOperations = (user: any) => {
  const createBasket = useCallback(async (basketData: CreateBasketData): Promise<MyBasket> => {
    if (!user) {
      throw new Error('Authentication required to create basket');
    }

    console.log('Creating basket with data:', basketData);
    console.log('User ID:', user.id);

    const insertData = transformBasketToDb(basketData, user.id);
    console.log('Insert data:', insertData);

    const { data, error } = await supabase
      .from('baskets')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Basket created successfully:', data);
    return transformBasketFromDb(data);
  }, [user]);

  const updateBasket = useCallback(async (id: string, updates: Partial<MyBasket>) => {
    if (!user) throw new Error('Authentication required');

    const { error } = await supabase
      .from('baskets')
      .update({
        title: updates.name,
        description: updates.description,
        goal_amount: updates.goal || updates.goalAmount,
        duration_days: updates.duration || updates.durationDays,
        category: updates.category,
        country: updates.country,
        is_private: updates.isPrivate,
        tags: updates.tags || []
      })
      .eq('id', id)
      .eq('creator_id', user.id);

    if (error) throw error;
  }, [user]);

  const deleteBasket = useCallback(async (id: string) => {
    if (!user) throw new Error('Authentication required');

    const { error } = await supabase
      .from('baskets')
      .delete()
      .eq('id', id)
      .eq('creator_id', user.id);

    if (error) throw error;
  }, [user]);

  return {
    createBasket,
    updateBasket,
    deleteBasket
  };
};
