
import React, { createContext, useContext, useState } from 'react';

export interface Basket {
  id: string;
  name: string;
  description: string;
  privacy: 'public' | 'private';
  isPrivate?: boolean; // Add this property to fix the TypeScript error
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
  getBasket: (basketId: string) => Basket | undefined;
  joinBasket: (basketId: string) => void;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

// Updated dummy data with more variety
const initialBaskets: Basket[] = [
  // Admin-created public baskets (shows in feed)
  {
    id: '1',
    name: 'Community Sports Equipment',
    description: 'Funding sports equipment for our local community center to help kids stay active and healthy',
    privacy: 'public',
    createdByAdmin: true,
    progress: 75,
    goal: 100000,
    currentAmount: 75000,
    participants: 45,
    daysLeft: 12,
    isMember: false,
    myContribution: 0,
  },
  {
    id: '5',
    name: 'School Library Renovation',
    description: 'Renovating our community school library with new books and computers for better learning',
    privacy: 'public',
    createdByAdmin: true,
    progress: 40,
    goal: 200000,
    currentAmount: 80000,
    participants: 68,
    daysLeft: 25,
    isMember: false,
    myContribution: 0,
  },
  {
    id: '6',
    name: 'Local Park Playground',
    description: 'Building a new playground for children in our neighborhood park',
    privacy: 'public',
    createdByAdmin: true,
    progress: 60,
    goal: 150000,
    currentAmount: 90000,
    participants: 32,
    daysLeft: 18,
    isMember: true, // User is already a member
    myContribution: 5000,
  },
  {
    id: '7',
    name: 'Youth Soccer Team Uniforms',
    description: 'Getting new uniforms for our local youth soccer team for the upcoming season',
    privacy: 'public',
    createdByAdmin: true,
    progress: 85,
    goal: 75000,
    currentAmount: 63750,
    participants: 28,
    daysLeft: 8,
    isMember: true, // User is already a member
    myContribution: 2500,
  },
  {
    id: '8',
    name: 'Community Garden Project',
    description: 'Creating a shared community garden where families can grow their own vegetables',
    privacy: 'public',
    createdByAdmin: true,
    progress: 30,
    goal: 80000,
    currentAmount: 24000,
    participants: 15,
    daysLeft: 30,
    isMember: false,
    myContribution: 0,
  },
  // User-created private baskets (doesn't show in feed)
  {
    id: '2',
    name: 'Team Jersey Fund',
    description: 'Getting new jerseys for our football team',
    privacy: 'private',
    createdByAdmin: false,
    progress: 60,
    goal: 50000,
    currentAmount: 30000,
    participants: 15,
    daysLeft: 8,
    isMember: false,
    myContribution: 0,
  },
];

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baskets, setBaskets] = useState<Basket[]>(initialBaskets);

  const getNonMemberBaskets = () => {
    return baskets.filter(basket => !basket.isMember);
  };

  const getBasket = (basketId: string) => {
    return baskets.find(basket => basket.id === basketId);
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
