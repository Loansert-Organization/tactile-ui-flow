
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
    // This would typically call a backend API to join a basket
    console.log('Joining basket:', basketData.id);
    return basketData as MyBasket;
  };

  const updateBasketStatus = (basketId: string, status: 'pending' | 'approved' | 'private') => {
    console.log('Updating basket status:', basketId, status);
    // This would typically update the basket status in the backend
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
