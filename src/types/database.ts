
// Database types to match the actual schema
export interface Database {
  public: {
    Tables: {
      baskets: {
        Row: {
          id: string;
          title: string;
          name: string;
          description: string | null;
          creator_id: string | null;
          goal_amount: number | null;
          current_amount: number | null;
          participants_count: number | null;
          duration_days: number | null;
          category: string | null;
          tags: unknown[] | null;
          currency: string | null;
          country: string | null;
          status: string | null;
          is_private: boolean | null;
          is_public: boolean | null;
          momo_code: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          name?: string;
          description?: string | null;
          creator_id?: string | null;
          goal_amount?: number | null;
          current_amount?: number | null;
          participants_count?: number | null;
          duration_days?: number | null;
          category?: string | null;
          tags?: unknown[] | null;
          currency?: string | null;
          country?: string | null;
          status?: string | null;
          is_private?: boolean | null;
          is_public?: boolean | null;
          momo_code?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          name?: string;
          description?: string | null;
          creator_id?: string | null;
          goal_amount?: number | null;
          current_amount?: number | null;
          participants_count?: number | null;
          duration_days?: number | null;
          category?: string | null;
          tags?: unknown[] | null;
          currency?: string | null;
          country?: string | null;
          status?: string | null;
          is_private?: boolean | null;
          is_public?: boolean | null;
          momo_code?: string | null;
          created_at?: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          phone_number: string | null;
          whatsapp_number: string | null;
          mobile_money_number: string | null;
          country: string | null;
          auth_method: string | null;
          is_anonymous: boolean | null;
          role: 'user' | 'admin' | 'owner' | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          phone_number?: string | null;
          whatsapp_number?: string | null;
          mobile_money_number?: string | null;
          country?: string | null;
          auth_method?: string | null;
          is_anonymous?: boolean | null;
          role?: 'user' | 'admin' | 'owner' | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          phone_number?: string | null;
          whatsapp_number?: string | null;
          mobile_money_number?: string | null;
          country?: string | null;
          auth_method?: string | null;
          is_anonymous?: boolean | null;
          role?: 'user' | 'admin' | 'owner' | null;
          created_at?: string | null;
        };
      };
    };
  };
}

export type UserRole = 'user' | 'admin' | 'owner';
