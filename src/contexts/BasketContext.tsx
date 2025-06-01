
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Basket {
  id: string;
  name: string;
  description: string;
  goal: number;
  currentAmount: number;
  progress: number;
  participants: number;
  isMember: boolean;
  myContribution: number;
  daysLeft: number;
  isPrivate: boolean;
}

interface BasketContextType {
  baskets: Basket[];
  getNonMemberBaskets: () => Basket[];
  getMemberBaskets: () => Basket[];
  getBasketById: (id: string) => Basket | undefined;
  joinBasket: (basketId: string) => void;
  contributeToBasket: (basketId: string, amount: number) => void;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

// Mock data for development
const MOCK_BASKETS: Basket[] = [
  {
    id: '1',
    name: 'Manchester United Away Jersey',
    description: 'Group fund for the new away jersey',
    goal: 500,
    currentAmount: 320,
    progress: 64,
    participants: 8,
    isMember: false,
    myContribution: 0,
    daysLeft: 15,
    isPrivate: false,
  },
  {
    id: '2',
    name: 'Champions League Final Tickets',
    description: 'Saving together for final tickets',
    goal: 2000,
    currentAmount: 850,
    progress: 42,
    participants: 12,
    isMember: true,
    myContribution: 150,
    daysLeft: 45,
    isPrivate: false,
  },
  {
    id: '3',
    name: 'Liverpool Home Kit',
    description: 'New season home kit fund',
    goal: 400,
    currentAmount: 380,
    progress: 95,
    participants: 6,
    isMember: false,
    myContribution: 0,
    daysLeft: 5,
    isPrivate: false,
  },
];

export function BasketProvider({ children }: { children: ReactNode }) {
  const [baskets, setBaskets] = useState<Basket[]>(MOCK_BASKETS);

  const getNonMemberBaskets = () => {
    return baskets.filter(basket => !basket.isMember);
  };

  const getMemberBaskets = () => {
    return baskets.filter(basket => basket.isMember);
  };

  const getBasketById = (id: string) => {
    return baskets.find(basket => basket.id === id);
  };

  const joinBasket = (basketId: string) => {
    setBaskets(prev => prev.map(basket => 
      basket.id === basketId 
        ? { ...basket, isMember: true, participants: basket.participants + 1 }
        : basket
    ));
  };

  const contributeToBasket = (basketId: string, amount: number) => {
    setBaskets(prev => prev.map(basket => 
      basket.id === basketId 
        ? { 
            ...basket, 
            currentAmount: basket.currentAmount + amount,
            myContribution: basket.myContribution + amount,
            progress: Math.round(((basket.currentAmount + amount) / basket.goal) * 100)
          }
        : basket
    ));
  };

  const value = {
    baskets,
    getNonMemberBaskets,
    getMemberBaskets,
    getBasketById,
    joinBasket,
    contributeToBasket,
  };

  return (
    <BasketContext.Provider value={value}>
      {children}
    </BasketContext.Provider>
  );
}

export function useBaskets() {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error('useBaskets must be used within a BasketProvider');
  }
  return context;
}
