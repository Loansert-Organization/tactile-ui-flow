
import React, { createContext, useContext } from 'react';
import { useMyBaskets, MyBasket } from '@/hooks/useMyBaskets';

interface MyBasketsContextType {
  myBaskets: MyBasket[];
  joinBasket: (basketData: Partial<MyBasket> & { id: string; name: string }) => Promise<MyBasket>;
  createBasket: (basketData: Omit<MyBasket, 'id' | 'createdAt' | 'isMember' | 'myContribution'>) => Promise<MyBasket>;
  updateBasketStatus: (basketId: string, status: 'pending' | 'approved' | 'private') => void;
  isJoining: string | null;
}

const MyBasketsContext = createContext<MyBasketsContextType | undefined>(undefined);

export const MyBasketsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const basketsData = useMyBaskets();

  return (
    <MyBasketsContext.Provider value={basketsData}>
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
