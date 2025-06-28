import React, { createContext, useContext } from 'react';
import { useMyBaskets, MyBasket } from '@/hooks/useMyBaskets';

interface MyBasketsContextType {
  myBaskets: MyBasket[];
  baskets: MyBasket[];
  loading: boolean;
  loadBaskets: () => Promise<void>;
  createBasket: (basketData: any) => Promise<MyBasket>;
  updateBasket: (id: string, updates: Partial<MyBasket>) => Promise<void>;
  deleteBasket: (id: string) => Promise<void>;
  joinBasket: (basketData: Partial<MyBasket> & { id: string; name: string }) => Promise<MyBasket>;
  updateBasketStatus: (basketId: string, status: 'pending' | 'approved' | 'private') => void;
  isJoining: string | null;
}

const MyBasketsContext = createContext<MyBasketsContextType | undefined>(undefined);

export const MyBasketsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { baskets, loading, loadBaskets, createBasket, updateBasket, deleteBasket } = useMyBaskets();

  // Mock implementations for missing methods
  const joinBasket = async (basketData: Partial<MyBasket> & { id: string; name: string }): Promise<MyBasket> => {
    if (import.meta.env.DEV) console.log('Joining basket:', basketData.id);
    // TODO: Implement actual basket joining logic
    return basketData as MyBasket;
  };

  const updateBasketStatus = (basketId: string, status: 'pending' | 'approved' | 'private') => {
    if (import.meta.env.DEV) console.log('Updating basket status:', basketId, status);
    // TODO: Implement actual status update logic
  };

  const contextValue: MyBasketsContextType = {
    myBaskets: baskets,
    baskets,
    loading,
    loadBaskets,
    createBasket,
    updateBasket,
    deleteBasket,
    joinBasket,
    updateBasketStatus,
    isJoining: null
  };

  return (
    <MyBasketsContext.Provider value={contextValue}>
      {children}
    </MyBasketsContext.Provider>
  );
};

export const useMyBasketsContext = () => {
  const context = useContext(MyBasketsContext);
  if (context === undefined) {
    throw new Error('useMyBasketsContext must be used within a MyBasketsProvider');
  }
  return context;
};
