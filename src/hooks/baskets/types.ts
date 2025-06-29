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

export interface BasketMember {
  id: string;
  basket_id: string;
  user_id: string;
  joined_at: string;
  is_creator: boolean;
  users: {
    id: string;
    display_name: string;
    avatar_url?: string;
    country: string;
    phone_number?: string;
    role: 'user' | 'admin';
  };
  contributions: {
    count: number;
    total_amount_local: number;
    total_amount_usd: number;
    latest_contribution_at?: string;
  };
}

export interface MemberInvitation {
  phone_number: string;
  message?: string;
}

export interface MemberStats {
  total_members: number;
  total_contributions: number;
  average_contribution: number;
  top_contributor: BasketMember | null;
  recent_members: BasketMember[];
}
