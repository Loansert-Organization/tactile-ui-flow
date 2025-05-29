
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Basket {
  id: string;
  name: string;
  description: string;
  goal: number;
  currentAmount: number;
  progress: number;
  participants: number;
  daysLeft: number;
  isMember: boolean;
  myContribution: number;
  isPrivate?: boolean;
}

interface BasketContextType {
  baskets: Basket[];
  joinBasket: (basketId: string) => void;
  getBasket: (basketId: string) => Basket | undefined;
  getNonMemberBaskets: () => Basket[];
  getMemberBaskets: () => Basket[];
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

const dummyBaskets: Basket[] = [
  {
    id: '1',
    name: 'Arsenal Season Tickets',
    description: 'Pooling together to get season tickets for the Emirates Stadium. Join us for every home game!',
    progress: 75,
    goal: 2000000,
    currentAmount: 1500000,
    participants: 12,
    daysLeft: 15,
    isMember: false,
    myContribution: 0,
    isPrivate: false
  },
  {
    id: '2',
    name: 'Weekend Getaway Fund',
    description: 'Saving up for an amazing weekend trip to Lake Kivu. Beautiful views and great memories await!',
    progress: 45,
    goal: 500000,
    currentAmount: 225000,
    participants: 8,
    daysLeft: 22,
    isMember: false,
    myContribution: 0,
    isPrivate: false
  },
  {
    id: '3',
    name: 'Lakers Championship Ring',
    description: 'Supporting our team to get that championship ring!',
    progress: 65,
    goal: 50000,
    currentAmount: 32500,
    participants: 47,
    daysLeft: 10,
    isMember: true,
    myContribution: 15000,
    isPrivate: false
  },
  {
    id: '4',
    name: 'Manchester United Jersey',
    description: 'Getting the new season jersey for the whole squad',
    progress: 80,
    goal: 25000,
    currentAmount: 20000,
    participants: 23,
    daysLeft: 5,
    isMember: true,
    myContribution: 5000,
    isPrivate: false
  },
  {
    id: '5',
    name: 'Community Garden Project',
    description: 'Building a sustainable community garden in Kimisagara. Growing together, thriving together.',
    progress: 30,
    goal: 800000,
    currentAmount: 240000,
    participants: 24,
    daysLeft: 30,
    isMember: false,
    myContribution: 0,
    isPrivate: false
  }
];

export const BasketProvider = ({ children }: { children: ReactNode }) => {
  const [baskets, setBaskets] = useState<Basket[]>(dummyBaskets);

  const joinBasket = (basketId: string) => {
    setBaskets(prev => prev.map(basket => 
      basket.id === basketId 
        ? { ...basket, isMember: true, myContribution: 10000, participants: basket.participants + 1 }
        : basket
    ));
  };

  const getBasket = (basketId: string) => {
    return baskets.find(basket => basket.id === basketId);
  };

  const getNonMemberBaskets = () => {
    return baskets.filter(basket => !basket.isMember);
  };

  const getMemberBaskets = () => {
    return baskets.filter(basket => basket.isMember);
  };

  return (
    <BasketContext.Provider value={{
      baskets,
      joinBasket,
      getBasket,
      getNonMemberBaskets,
      getMemberBaskets
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
