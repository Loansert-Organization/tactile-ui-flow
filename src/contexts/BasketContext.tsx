import React, { createContext, useContext, useState } from 'react';

export interface Basket {
  id: string;
  name: string;
  description: string;
  privacy: 'public' | 'private';
  createdByAdmin: boolean;
  progress: number;
  goal: number;
  currentAmount: number;
  participants: number;
  daysLeft: number;
  isMember: boolean;
  myContribution: number;
}

interface BasketContextType {
  baskets: Basket[];
  getPublicBaskets: () => Basket[];
  getBasket: (basketId: string) => Basket | undefined;
  joinBasket: (basketId: string) => void;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baskets, setBaskets] = useState<Basket[]>([]);

  const getPublicBaskets = () => {
    // This context is deprecated in favor of real Supabase integration
    // Public baskets should be fetched using the Feed page with React Query
    console.warn('BasketContext.getPublicBaskets() is deprecated. Use Feed page with Supabase integration instead.');
    return baskets.filter(basket => basket.privacy === 'public' && basket.createdByAdmin === true);
  };

  const getBasket = (basketId: string) => {
    // This context is deprecated in favor of real Supabase integration
    // Individual baskets should be fetched using BasketDetailPage with React Query
    console.warn('BasketContext.getBasket() is deprecated. Use BasketDetailPage with Supabase integration instead.');
    return baskets.find(basket => basket.id === basketId);
  };

  const joinBasket = (basketId: string) => {
    // This context is deprecated in favor of real Supabase integration
    // Basket membership should be managed using useBasketMembers hook
    console.warn('BasketContext.joinBasket() is deprecated. Use useBasketMembers hook instead.');
    setBaskets(prev => 
      prev.map(basket => 
        basket.id === basketId 
          ? { ...basket, isMember: true, participants: basket.participants + 1 }
          : basket
      )
    );
  };

  return (
    <BasketContext.Provider value={{
      baskets,
      getPublicBaskets,
      getBasket,
      joinBasket
    }}>
      {children}
    </BasketContext.Provider>
  );
};

export const useBaskets = () => {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error('useBaskets must be used within a BasketProvider');
  }
  return context;
};
