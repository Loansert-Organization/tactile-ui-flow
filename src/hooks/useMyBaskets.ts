import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { useSessionId } from "@/hooks/useSessionId";

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

// Updated dummy data with more variety including public baskets user has joined
const initialBaskets: MyBasket[] = [
  // User's private baskets
  {
    id: '3',
    name: 'Lakers Championship Ring',
    description: 'Supporting our team to get that championship ring!',
    status: 'private',
    isPrivate: true,
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
  },
  // Public baskets user has joined (from main basket context)
  {
    id: '6',
    name: 'Local Park Playground',
    description: 'Building a new playground for children in our neighborhood park',
    status: 'approved',
    isPrivate: false, // This is a public basket
    progress: 60,
    goal: 150000,
    currentAmount: 90000,
    participants: 32,
    daysLeft: 18,
    isMember: true,
    myContribution: 5000,
    createdAt: new Date('2024-05-10')
  },
  {
    id: '7',
    name: 'Youth Soccer Team Uniforms',
    description: 'Getting new uniforms for our local youth soccer team for the upcoming season',
    status: 'approved',
    isPrivate: false, // This is a public basket
    progress: 85,
    goal: 75000,
    currentAmount: 63750,
    participants: 28,
    daysLeft: 8,
    isMember: true,
    myContribution: 2500,
    createdAt: new Date('2024-05-18')
  }
];

export const useMyBaskets = () => {
  const sessionId = useSessionId();
  const [myBaskets, setMyBaskets] = useState<MyBasket[]>(initialBaskets);
  const [isJoining, setIsJoining] = useState<string | null>(null);

  // Placeholder demo
  // In the future, this should call supabase.from('baskets')...

  const joinBasket = useCallback(async (basketData: Partial<MyBasket> & { id: string; name: string }) => {
    setIsJoining(basketData.id);

    // Example: insert event in events table for Supabase linkage
    await supabase.from('events').insert({
      session_id: sessionId,
      event_type: 'basket_joined',
      event_data: basketData,
    });

    // For demo, just update locally
    const newBasket: MyBasket = {
      ...basketData,
      id: basketData.id,
      name: basketData.name,
      description: basketData.description || 'A community funding basket',
      status: 'approved',
      isPrivate: false, // Joined public baskets are not private
      progress: basketData.progress || 45,
      goal: basketData.goal || 10000,
      currentAmount: basketData.currentAmount || 4500,
      participants: basketData.participants || 12,
      daysLeft: basketData.daysLeft || 15,
      isMember: true,
      myContribution: 0,
      createdAt: new Date()
    } as MyBasket;

    setMyBaskets(prev => [newBasket, ...prev]);
    setIsJoining(null);

    toast.success(`You've joined '${basketData.name}'!`, {
      description: 'Start contributing to reach the goal together',
      duration: 3000,
    });

    return newBasket;
  }, [sessionId]);

  const createBasket = useCallback(async (basketData: Omit<MyBasket, 'id' | 'createdAt' | 'isMember' | 'myContribution'>) => {
    // Example: insert event in events table for Supabase linkage
    await supabase.from('events').insert({
      session_id: sessionId,
      event_type: 'basket_created',
      event_data: basketData,
    });

    const newBasket: MyBasket = {
      ...basketData,
      id: `basket-${Date.now()}`,
      status: 'private', // All user-created baskets are private and live immediately
      isPrivate: true,
      isMember: true,
      myContribution: 0,
      participants: 1,
      currentAmount: 0,
      progress: 0,
      createdAt: new Date()
    };

    setMyBaskets(prev => [newBasket, ...prev]);

    toast.success(`Your basket '${basketData.name}' has been created!`, {
      description: 'Your private basket is ready and live',
      duration: 3000,
    });

    return newBasket;
  }, [sessionId]);

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
