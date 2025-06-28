export interface MyBasket {
  id: string;
  name: string;
  description: string;
  goal: number;
  goalAmount: number; // alias for goal
  currentAmount: number;
  progress: number;
  participants: number;
  daysLeft: number;
  status: 'active' | 'completed' | 'expired';
  isMember: boolean;
  myContribution: number;
  createdAt: string;
  category: string;
  country: string;
  isPrivate: boolean;
  isPublic: boolean;
  momoCode?: string;
  currency: string;
  duration: number;
  durationDays: number; // alias for duration
  tags?: string[];
}

export interface CreateBasketData {
  name: string;
  description: string;
  goal: number;
  duration: number;
  category: string;
  country: string;
  isPrivate: boolean;
  isPublic: boolean;
  tags?: string[];
}
