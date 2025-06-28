
import { useCallback } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useBasketData } from './baskets/useBasketData';
import { useBasketOperations } from './baskets/useBasketOperations';
import { CreateBasketData, MyBasket } from './baskets/types';

export type { MyBasket, CreateBasketData } from './baskets/types';

export const useMyBaskets = () => {
  const { user } = useAuthContext();
  const { baskets, loading, setLoading, loadBaskets, addBasket, updateBasketInState, removeBasket } = useBasketData(user);
  const { createBasket: createBasketOp, updateBasket: updateBasketOp, deleteBasket: deleteBasketOp } = useBasketOperations(user);

  const createBasket = useCallback(async (basketData: CreateBasketData) => {
    setLoading(true);
    try {
      const newBasket = await createBasketOp(basketData);
      addBasket(newBasket);
      return newBasket;
    } catch (error) {
      console.error('Error creating basket:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [createBasketOp, addBasket, setLoading]);

  const updateBasket = useCallback(async (id: string, updates: Partial<MyBasket>) => {
    setLoading(true);
    try {
      await updateBasketOp(id, updates);
      updateBasketInState(id, updates);
    } catch (error) {
      console.error('Error updating basket:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [updateBasketOp, updateBasketInState, setLoading]);

  const deleteBasket = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await deleteBasketOp(id);
      removeBasket(id);
    } catch (error) {
      console.error('Error deleting basket:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [deleteBasketOp, removeBasket, setLoading]);

  return {
    baskets,
    loading,
    loadBaskets,
    createBasket,
    updateBasket,
    deleteBasket
  };
};
