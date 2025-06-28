
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export interface MyBasket {
  id: string;
  name: string;
  description: string;
  goal: number;
  goalAmount: number; // alias for goal
  currentAmount: number;
  progress: number;
  participants: number;
  daysLeft: number;
  status: 'active' | 'completed' | 'expired';
  isMember: boolean;
  myContribution: number;
  createdAt: string;
  category: string;
  country: string;
  isPrivate: boolean;
  momoCode?: string;
  currency: string;
  duration: number;
  durationDays: number; // alias for duration
  tags?: string[];
}

interface CreateBasketData {
  name: string;
  description: string;
  goal: number;
  duration: number;
  category: string;
  country: string;
  isPrivate: boolean;
  tags?: string[];
}

export const useMyBaskets = () => {
  const [baskets, setBaskets] = useState<MyBasket[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();

  const loadBaskets = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('baskets')
        .select('*')
        .eq('creator_id', user.id);

      if (error) throw error;

      const transformedBaskets: MyBasket[] = (data || []).map(basket => ({
        id: basket.id,
        name: basket.title || 'Untitled Basket',
        description: basket.description || '',
        goal: basket.goal_amount || 0,
        goalAmount: basket.goal_amount || 0,
        currentAmount: basket.current_amount || 0,
        progress: basket.goal_amount ? Math.round((basket.current_amount || 0) / basket.goal_amount * 100) : 0,
        participants: basket.participants_count || 1,
        daysLeft: basket.duration_days || 30,
        status: basket.status as 'active' | 'completed' | 'expired' || 'active',
        isMember: true,
        myContribution: 0, // Would need to calculate from contributions table
        createdAt: basket.created_at || new Date().toISOString(),
        category: basket.category || 'personal',
        country: basket.country || 'RW',
        isPrivate: basket.is_private || false,
        momoCode: basket.momo_code,
        currency: basket.currency || 'RWF',
        duration: basket.duration_days || 30,
        durationDays: basket.duration_days || 30,
        tags: basket.tags ? (Array.isArray(basket.tags) ? basket.tags : []) : []
      }));

      setBaskets(transformedBaskets);
    } catch (error) {
      console.error('Error loading baskets:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createBasket = useCallback(async (basketData: CreateBasketData) => {
    if (!user) {
      throw new Error('Authentication required to create basket');
    }

    console.log('Creating basket with data:', basketData);
    console.log('User ID:', user.id);

    setLoading(true);
    try {
      // Prepare the basket data for insertion
      const insertData = {
        title: basketData.name,
        description: basketData.description,
        goal_amount: basketData.goal,
        duration_days: basketData.duration,
        category: basketData.category,
        country: basketData.country,
        is_private: basketData.isPrivate,
        creator_id: user.id,
        currency: basketData.country === 'RW' ? 'RWF' : 'USD',
        status: 'active',
        current_amount: 0,
        participants_count: 1,
        tags: basketData.tags || []
      };

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

      // Transform the created basket to MyBasket format
      const newBasket: MyBasket = {
        id: data.id,
        name: data.title || basketData.name,
        description: data.description || basketData.description,
        goal: data.goal_amount || basketData.goal,
        goalAmount: data.goal_amount || basketData.goal,
        currentAmount: data.current_amount || 0,
        progress: 0,
        participants: data.participants_count || 1,
        daysLeft: data.duration_days || basketData.duration,
        status: data.status as 'active' | 'completed' | 'expired' || 'active',
        isMember: true,
        myContribution: 0,
        createdAt: data.created_at || new Date().toISOString(),
        category: data.category || basketData.category,
        country: data.country || basketData.country,
        isPrivate: data.is_private || basketData.isPrivate,
        momoCode: data.momo_code,
        currency: data.currency || (basketData.country === 'RW' ? 'RWF' : 'USD'),
        duration: data.duration_days || basketData.duration,
        durationDays: data.duration_days || basketData.duration,
        tags: data.tags ? (Array.isArray(data.tags) ? data.tags : []) : []
      };

      // Add to local state
      setBaskets(prev => [newBasket, ...prev]);
      
      return newBasket;
    } catch (error) {
      console.error('Error creating basket:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateBasket = useCallback(async (id: string, updates: Partial<MyBasket>) => {
    if (!user) throw new Error('Authentication required');

    setLoading(true);
    try {
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

      // Update local state
      setBaskets(prev => prev.map(basket => 
        basket.id === id ? { ...basket, ...updates } : basket
      ));
    } catch (error) {
      console.error('Error updating basket:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteBasket = useCallback(async (id: string) => {
    if (!user) throw new Error('Authentication required');

    setLoading(true);
    try {
      const { error } = await supabase
        .from('baskets')
        .delete()
        .eq('id', id)
        .eq('creator_id', user.id);

      if (error) throw error;

      // Remove from local state
      setBaskets(prev => prev.filter(basket => basket.id !== id));
    } catch (error) {
      console.error('Error deleting basket:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    baskets,
    loading,
    loadBaskets,
    createBasket,
    updateBasket,
    deleteBasket
  };
};
