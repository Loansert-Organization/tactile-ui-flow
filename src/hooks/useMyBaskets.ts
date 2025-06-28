
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

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
  category?: string;
  country?: string;
  momoCode?: string;
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
  const [myBaskets, setMyBaskets] = useState<MyBasket[]>(initialBaskets);
  const [isJoining, setIsJoining] = useState<string | null>(null);
  const { user } = useAuthContext();

  const joinBasket = useCallback(async (basketData: Partial<MyBasket> & { id: string; name: string }) => {
    setIsJoining(basketData.id);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newBasket: MyBasket = {
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
    };

    setMyBaskets(prev => [newBasket, ...prev]);
    setIsJoining(null);
    
    toast.success(`You've joined '${basketData.name}'!`, {
      description: 'Start contributing to reach the goal together',
      duration: 3000,
    });

    return newBasket;
  }, []);

  const createBasket = useCallback(async (basketData: {
    name: string;
    description: string;
    goal: number;
    duration?: number;
    category?: string;
    country?: string;
    isPrivate?: boolean;
  }) => {
    console.log('🔄 Creating basket with Supabase integration...');
    
    // Check if user is authenticated
    if (!user) {
      throw new Error('Authentication required. Please log in to create a basket.');
    }

    try {
      // Calculate days left based on duration
      const durationDays = basketData.duration || 30;
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + durationDays);
      
      // Insert basket into Supabase
      const { data, error } = await supabase
        .from('baskets')
        .insert({
          creator_id: user.id,
          title: basketData.name,
          description: basketData.description,
          goal_amount: basketData.goal,
          duration_days: durationDays,
          category: basketData.category || 'General',
          country: basketData.country || 'RW',
          currency: 'RWF', // Default to Rwanda Francs
          is_private: basketData.isPrivate || false,
          current_amount: 0,
          participants_count: 1,
          status: 'active',
          tags: []
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase basket creation error:', error);
        throw new Error(`Failed to create basket: ${error.message}`);
      }

      console.log('✅ Basket created successfully:', data);

      // Transform Supabase response to MyBasket format
      const newBasket: MyBasket = {
        id: data.id,
        name: data.title || basketData.name,
        description: data.description || basketData.description,
        status: basketData.isPrivate ? 'private' : 'approved',
        isPrivate: data.is_private || false,
        goal: data.goal_amount || basketData.goal,
        currentAmount: data.current_amount || 0,
        participants: data.participants_count || 1,
        daysLeft: durationDays,
        progress: 0,
        isMember: true,
        myContribution: 0,
        createdAt: new Date(data.created_at || new Date()),
        category: data.category,
        country: data.country,
        momoCode: data.momo_code
      };

      // Add to local state
      setMyBaskets(prev => [newBasket, ...prev]);
      
      toast.success(`Basket '${basketData.name}' created successfully!`, {
        description: data.momo_code ? `Payment code: ${data.momo_code}` : 'Your basket is ready to receive contributions',
        duration: 5000,
      });

      return newBasket;
    } catch (error) {
      console.error('❌ Basket creation failed:', error);
      throw error;
    }
  }, [user]);

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
