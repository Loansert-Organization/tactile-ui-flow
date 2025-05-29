
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface MyBasket {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'approved' | 'private';
  isPrivate: boolean;
  progress: number;
  goal: number;
  currentAmount: number;
  participants: number;
  daysLeft: number;
  isMember: boolean;
  myContribution: number;
  createdAt: Date;
}

// Initial dummy data for existing baskets
const initialBaskets: MyBasket[] = [
  {
    id: '3',
    name: 'Lakers Championship Ring',
    description: 'Supporting our team to get that championship ring!',
    status: 'approved',
    isPrivate: false,
    progress: 65,
    goal: 50000,
    currentAmount: 32500,
    participants: 47,
    daysLeft: 10,
    isMember: true,
    myContribution: 15000,
    createdAt: new Date('2024-05-15')
  },
  {
    id: '4',
    name: 'Manchester United Jersey',
    description: 'Getting the new season jersey for the whole squad',
    status: 'private',
    isPrivate: true,
    progress: 80,
    goal: 25000,
    currentAmount: 20000,
    participants: 23,
    daysLeft: 5,
    isMember: true,
    myContribution: 5000,
    createdAt: new Date('2024-05-20')
  }
];

export const useMyBaskets = () => {
  const [myBaskets, setMyBaskets] = useState<MyBasket[]>(initialBaskets);
  const [isJoining, setIsJoining] = useState<string | null>(null);

  const joinBasket = useCallback(async (basketData: Partial<MyBasket> & { id: string; name: string }) => {
    setIsJoining(basketData.id);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newBasket: MyBasket = {
      id: basketData.id,
      name: basketData.name,
      description: basketData.description || 'A community funding basket',
      status: 'approved',
      isPrivate: false,
      progress: basketData.progress || 45,
      goal: basketData.goal || 10000,
      currentAmount: basketData.currentAmount || 4500,
      participants: basketData.participants || 12,
      daysLeft: basketData.daysLeft || 15,
      isMember: true,
      myContribution: 0,
      createdAt: new Date()
    };

    setMyBaskets(prev => [newBasket, ...prev]);
    setIsJoining(null);
    
    toast.success(`You've joined '${basketData.name}'!`, {
      description: 'Start contributing to reach the goal together',
      duration: 3000,
    });

    return newBasket;
  }, []);

  const createBasket = useCallback(async (basketData: Omit<MyBasket, 'id' | 'createdAt' | 'isMember' | 'myContribution'>) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newBasket: MyBasket = {
      ...basketData,
      id: `basket-${Date.now()}`,
      isMember: true,
      myContribution: 0,
      createdAt: new Date()
    };

    setMyBaskets(prev => [newBasket, ...prev]);
    
    toast.success(`Your basket '${basketData.name}' has been created!`, {
      description: basketData.isPrivate ? 'Your private basket is ready' : 'Your basket is pending approval',
      duration: 3000,
    });

    return newBasket;
  }, []);

  const updateBasketStatus = useCallback((basketId: string, status: 'pending' | 'approved' | 'private') => {
    setMyBaskets(prev => 
      prev.map(basket => 
        basket.id === basketId 
          ? { ...basket, status }
          : basket
      )
    );
  }, []);

  return {
    myBaskets,
    joinBasket,
    createBasket,
    updateBasketStatus,
    isJoining
  };
};
