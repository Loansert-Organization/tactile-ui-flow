// Updated basket types to match schema
export interface CreateBasketData {
  title: string;
  name?: string;
  description: string;
  goalAmount: number;
  currency: string;
  durationDays: number;
  category?: string;
  country: string;
  isPrivate?: boolean;
  isPublic?: boolean;
  tags?: string[];
}

export interface MyBasket {
  id: string;
  title: string;
  name?: string;
  description: string | null;
  goal_amount: number | null;
  current_amount: number | null;
  participants_count: number | null;
  duration_days: number | null;
  category: string | null;
  currency: string | null;
  country: string | null;
  status: string | null;
  is_private: boolean | null;
  is_public: boolean | null;
  created_at: string | null;
  creator_id: string | null;
}

export interface BasketMember {
  id: string;
  basket_id: string;
  user_id: string;
  joined_at: string;
  is_creator: boolean;
  users: {
    display_name: string;
    avatar_url: string | null;
    role: 'user' | 'admin' | 'owner' | null;
  };
  contributions?: {
    count: number;
    total_amount_local: number;
    total_amount_usd: number;
    latest_contribution_at: string;
  };
}

export interface Basket {
  id: string;
  name: string;
  description: string;
  goal: number;
  totalContributions: number;
  participants: number;
  progress: number;
  daysLeft: number;
  isOwner: boolean;
  is_public: boolean;
}
