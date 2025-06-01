
import React, { createContext, useContext, useState } from 'react';

export interface Basket {
  id: string;
  name: string;
  description: string;
  privacy: 'public' | 'private';
  createdByAdmin: boolean; // New field to distinguish admin vs user baskets
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
  getNonMemberBaskets: () => Basket[];
  joinBasket: (basketId: string) => void;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

// Updated dummy data with admin flag
const initialBaskets: Basket[] = [
  // Admin-created public basket (shows in feed)
  {
    id: '1',
    name: 'Community Sports Equipment',
    description: 'Funding sports equipment for our local community center',
    privacy: 'public',
    createdByAdmin: true, // Admin-created, shows in feed
    progress: 75,
    goal: 100000,
    currentAmount: 75000,
    participants: 45,
    daysLeft: 12,
    isMember: false,
    myContribution: 0,
  },
  // User-created private basket (doesn't show in feed)
  {
    id: '2',
    name: 'Team Jersey Fund',
    description: 'Getting new jerseys for our football team',
    privacy: 'private',
    createdByAdmin: false, // User-created, won't show in feed
    progress: 60,
    goal: 50000,
    currentAmount: 30000,
    participants: 15,
    daysLeft: 8,
    isMember: false,
    myContribution: 0,
  },
  // Another admin-created public basket
  {
    id: '5',
    name: 'School Library Renovation',
    description: 'Renovating our community school library with new books and computers',
    privacy: 'public',
    createdByAdmin: true, // Admin-created, shows in feed
    progress: 40,
    goal: 200000,
    currentAmount: 80000,
    participants: 68,
    daysLeft: 25,
    isMember: false,
    myContribution: 0,
  },
];

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baskets, setBaskets] = useState<Basket[]>(initialBaskets);

  const getNonMemberBaskets = () => {
    return baskets.filter(basket => !basket.isMember);
  };

  const joinBasket = (basketId: string) => {
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
      getNonMemberBaskets,
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
