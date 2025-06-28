
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MyBasket } from './types';
import { transformBasketFromDb } from './basketTransformers';

export const useBasketData = (user: any) => {
  const [baskets, setBaskets] = useState<MyBasket[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBaskets = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('baskets')
        .select('*')
        .eq('creator_id', user.id);

      if (error) throw error;

      const transformedBaskets: MyBasket[] = (data || []).map(transformBasketFromDb);
      setBaskets(transformedBaskets);
    } catch (error) {
      console.error('Error loading baskets:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addBasket = useCallback((basket: MyBasket) => {
    setBaskets(prev => [basket, ...prev]);
  }, []);

  const updateBasketInState = useCallback((id: string, updates: Partial<MyBasket>) => {
    setBaskets(prev => prev.map(basket => 
      basket.id === id ? { ...basket, ...updates } : basket
    ));
  }, []);

  const removeBasket = useCallback((id: string) => {
    setBaskets(prev => prev.filter(basket => basket.id !== id));
  }, []);

  return {
    baskets,
    loading,
    setLoading,
    loadBaskets,
    addBasket,
    updateBasketInState,
    removeBasket
  };
};
