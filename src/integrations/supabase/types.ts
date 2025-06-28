export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_model_metrics: {
        Row: {
          average_confidence: number | null
          average_response_time: number | null
          created_at: string
          id: string
          model_name: string
          successful_requests: number | null
          suggestion_type: string
          total_requests: number | null
          updated_at: string
        }
        Insert: {
          average_confidence?: number | null
          average_response_time?: number | null
          created_at?: string
          id?: string
          model_name: string
          successful_requests?: number | null
          suggestion_type: string
          total_requests?: number | null
          updated_at?: string
        }
        Update: {
          average_confidence?: number | null
          average_response_time?: number | null
          created_at?: string
          id?: string
          model_name?: string
          successful_requests?: number | null
          suggestion_type?: string
          total_requests?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      ai_suggestions: {
        Row: {
          ai_model: string
          confidence_score: number | null
          created_at: string
          id: string
          input_data: Json
          status: string
          suggestion_content: Json
          suggestion_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_model: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          input_data: Json
          status?: string
          suggestion_content: Json
          suggestion_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_model?: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          input_data?: Json
          status?: string
          suggestion_content?: Json
          suggestion_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      baskets: {
        Row: {
          category: string | null
          country: string | null
          created_at: string | null
          creator_id: string | null
          currency: string | null
          current_amount: number | null
          description: string | null
          duration_days: number | null
          goal_amount: number | null
          id: string
          is_private: boolean | null
          momo_code: string | null
          participants_count: number | null
          status: string | null
          tags: Json | null
          title: string | null
        }
        Insert: {
          category?: string | null
          country?: string | null
          created_at?: string | null
          creator_id?: string | null
          currency?: string | null
          current_amount?: number | null
          description?: string | null
          duration_days?: number | null
          goal_amount?: number | null
          id?: string
          is_private?: boolean | null
          momo_code?: string | null
          participants_count?: number | null
          status?: string | null
          tags?: Json | null
          title?: string | null
        }
        Update: {
          category?: string | null
          country?: string | null
          created_at?: string | null
          creator_id?: string | null
          currency?: string | null
          current_amount?: number | null
          description?: string | null
          duration_days?: number | null
          goal_amount?: number | null
          id?: string
          is_private?: boolean | null
          momo_code?: string | null
          participants_count?: number | null
          status?: string | null
          tags?: Json | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "baskets_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      basket_members: {
        Row: {
          id: string
          basket_id: string
          user_id: string
          joined_at: string | null
          is_creator: boolean | null
        }
        Insert: {
          id?: string
          basket_id: string
          user_id: string
          joined_at?: string | null
          is_creator?: boolean | null
        }
        Update: {
          id?: string
          basket_id?: string
          user_id?: string
          joined_at?: string | null
          is_creator?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "basket_members_basket_id_fkey"
            columns: ["basket_id"]
            isOneToOne: false
            referencedRelation: "baskets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "basket_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      code_analysis_sessions: {
        Row: {
          analysis_type: string
          completed_at: string | null
          created_at: string
          files_analyzed: Json
          id: string
          session_name: string
          status: string
          total_suggestions: number | null
          user_id: string | null
        }
        Insert: {
          analysis_type: string
          completed_at?: string | null
          created_at?: string
          files_analyzed: Json
          id?: string
          session_name: string
          status?: string
          total_suggestions?: number | null
          user_id?: string | null
        }
        Update: {
          analysis_type?: string
          completed_at?: string | null
          created_at?: string
          files_analyzed?: Json
          id?: string
          session_name?: string
          status?: string
          total_suggestions?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "code_analysis_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contributions: {
        Row: {
          amount_local: number | null
          amount_usd: number | null
          basket_id: string | null
          confirmed: boolean | null
          created_at: string | null
          currency: string | null
          id: string
          momo_code: string | null
          payment_method: string | null
          user_id: string | null
        }
        Insert: {
          amount_local?: number | null
          amount_usd?: number | null
          basket_id?: string | null
          confirmed?: boolean | null
          created_at?: string | null
          currency?: string | null
          id?: string
          momo_code?: string | null
          payment_method?: string | null
          user_id?: string | null
        }
        Update: {
          amount_local?: number | null
          amount_usd?: number | null
          basket_id?: string | null
          confirmed?: boolean | null
          created_at?: string | null
          currency?: string | null
          id?: string
          momo_code?: string | null
          payment_method?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contributions_basket_id_fkey"
            columns: ["basket_id"]
            isOneToOne: false
            referencedRelation: "baskets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          code: string
          currency: string | null
          name: string | null
          p1_name: string | null
          p1_pay_bill: string | null
          p1_send_money: string | null
          p1_service: string | null
          p2_name: string | null
          p2_pay_bill: string | null
          p2_send_money: string | null
          p2_service: string | null
        }
        Insert: {
          code: string
          currency?: string | null
          name?: string | null
          p1_name?: string | null
          p1_pay_bill?: string | null
          p1_send_money?: string | null
          p1_service?: string | null
          p2_name?: string | null
          p2_pay_bill?: string | null
          p2_send_money?: string | null
          p2_service?: string | null
        }
        Update: {
          code?: string
          currency?: string | null
          name?: string | null
          p1_name?: string | null
          p1_pay_bill?: string | null
          p1_send_money?: string | null
          p1_service?: string | null
          p2_name?: string | null
          p2_pay_bill?: string | null
          p2_send_money?: string | null
          p2_service?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount_usd: number | null
          created_at: string | null
          id: string
          related_basket: string | null
          type: string | null
          wallet_id: string | null
        }
        Insert: {
          amount_usd?: number | null
          created_at?: string | null
          id?: string
          related_basket?: string | null
          type?: string | null
          wallet_id?: string | null
        }
        Update: {
          amount_usd?: number | null
          created_at?: string | null
          id?: string
          related_basket?: string | null
          type?: string | null
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_related_basket_fkey"
            columns: ["related_basket"]
            isOneToOne: false
            referencedRelation: "baskets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_method: string | null
          avatar_url: string | null
          country: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          is_anonymous: boolean | null
          mobile_money_number: string | null
          phone_number: string | null
          whatsapp_number: string | null
          role: string | null
        }
        Insert: {
          auth_method?: string | null
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          is_anonymous?: boolean | null
          mobile_money_number?: string | null
          phone_number?: string | null
          whatsapp_number?: string | null
          role?: string | null
        }
        Update: {
          auth_method?: string | null
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          is_anonymous?: boolean | null
          mobile_money_number?: string | null
          phone_number?: string | null
          whatsapp_number?: string | null
          role?: string | null
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance_usd: number | null
          id: string
          last_updated: string | null
          user_id: string | null
        }
        Insert: {
          balance_usd?: number | null
          id?: string
          last_updated?: string | null
          user_id?: string | null
        }
        Update: {
          balance_usd?: number | null
          id?: string
          last_updated?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_momo_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "owner" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "owner", "user"],
    },
  },
} as const
