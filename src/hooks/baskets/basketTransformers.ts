
import { MyBasket } from './types';

export const transformBasketFromDb = (basket: any): MyBasket => ({
  id: basket.id,
  name: basket.title || 'Untitled Basket',
  description: basket.description || '',
  goal: basket.goal_amount || 0,
  goalAmount: basket.goal_amount || 0,
  currentAmount: basket.current_amount || 0,
  progress: basket.goal_amount ? Math.round((basket.current_amount || 0) / basket.goal_amount * 100) : 0,
  participants: basket.participants_count || 1,
  daysLeft: basket.duration_days || 30,
  status: basket.status as 'active' | 'completed' | 'expired' || 'active',
  isMember: true,
  myContribution: 0, // Would need to calculate from contributions table
  createdAt: basket.created_at || new Date().toISOString(),
  category: basket.category || 'personal',
  country: basket.country || 'RW',
  isPrivate: basket.is_private || false,
  momoCode: basket.momo_code,
  currency: basket.currency || 'RWF',
  duration: basket.duration_days || 30,
  durationDays: basket.duration_days || 30,
  tags: Array.isArray(basket.tags) ? basket.tags.map(tag => String(tag)) : []
});

export const transformBasketToDb = (basketData: any, userId: string) => ({
  title: basketData.name,
  description: basketData.description,
  goal_amount: basketData.goal,
  duration_days: basketData.duration,
  category: basketData.category,
  country: basketData.country,
  is_private: basketData.isPrivate,
  creator_id: userId,
  currency: basketData.country === 'RW' ? 'RWF' : 'USD',
  status: 'active',
  current_amount: 0,
  participants_count: 1,
  tags: basketData.tags || []
});
