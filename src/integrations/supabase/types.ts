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
      activation_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          current_uses: number | null
          duration_days: number
          expires_at: string | null
          id: string
          is_used: boolean
          max_uses: number | null
          plan_type: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          duration_days?: number
          expires_at?: string | null
          id?: string
          is_used?: boolean
          max_uses?: number | null
          plan_type?: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          duration_days?: number
          expires_at?: string | null
          id?: string
          is_used?: boolean
          max_uses?: number | null
          plan_type?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activation_codes_used_by_fkey"
            columns: ["used_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_actions_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      client_arrivage: {
        Row: {
          boisson_id: number
          client_id: string
          created_at: string
          date_arrivage: string
          id: string
          quantite: number
          type_trous: number
          updated_at: string
          valeur: number
        }
        Insert: {
          boisson_id: number
          client_id: string
          created_at?: string
          date_arrivage?: string
          id?: string
          quantite?: number
          type_trous: number
          updated_at?: string
          valeur?: number
        }
        Update: {
          boisson_id?: number
          client_id?: string
          created_at?: string
          date_arrivage?: string
          id?: string
          quantite?: number
          type_trous?: number
          updated_at?: string
          valeur?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_arrivage_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      client_boissons: {
        Row: {
          boisson_id: number
          client_id: string
          created_at: string
          id: string
          nom: string
          prix: number
          special: boolean | null
          special_price: number | null
          special_unit: number | null
          trous: Json
          type: string
          updated_at: string
        }
        Insert: {
          boisson_id: number
          client_id: string
          created_at?: string
          id?: string
          nom: string
          prix: number
          special?: boolean | null
          special_price?: number | null
          special_unit?: number | null
          trous: Json
          type: string
          updated_at?: string
        }
        Update: {
          boisson_id?: number
          client_id?: string
          created_at?: string
          id?: string
          nom?: string
          prix?: number
          special?: boolean | null
          special_price?: number | null
          special_unit?: number | null
          trous?: Json
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_boissons_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      client_calculs: {
        Row: {
          client_id: string
          created_at: string
          date_calcul: string
          espece_gerant: number
          id: string
          somme_encaissee: number
          stock_ancien: number
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          date_calcul?: string
          espece_gerant?: number
          id?: string
          somme_encaissee?: number
          stock_ancien?: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          date_calcul?: string
          espece_gerant?: number
          id?: string
          somme_encaissee?: number
          stock_ancien?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_calculs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      client_depenses: {
        Row: {
          client_id: string
          created_at: string
          date_depense: string
          id: string
          montant: number
          motif: string
        }
        Insert: {
          client_id: string
          created_at?: string
          date_depense?: string
          id?: string
          montant: number
          motif: string
        }
        Update: {
          client_id?: string
          created_at?: string
          date_depense?: string
          id?: string
          montant?: number
          motif?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_depenses_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      client_stock: {
        Row: {
          boisson_id: number
          client_id: string
          created_at: string
          date_stock: string
          id: string
          quantite: number
          updated_at: string
          valeur: number
        }
        Insert: {
          boisson_id: number
          client_id: string
          created_at?: string
          date_stock?: string
          id?: string
          quantite?: number
          updated_at?: string
          valeur?: number
        }
        Update: {
          boisson_id?: number
          client_id?: string
          created_at?: string
          date_stock?: string
          id?: string
          quantite?: number
          updated_at?: string
          valeur?: number
        }
        Relationships: [
          {
            foreignKeyName: "client_stock_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          paid_at: string | null
          payment_method: string
          payment_status: string | null
          plan_id: string | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          paid_at?: string | null
          payment_method: string
          payment_status?: string | null
          plan_id?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          paid_at?: string | null
          payment_method?: string
          payment_status?: string | null
          plan_id?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          duration_days: number
          features: Json
          id: string
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_days: number
          features?: Json
          id?: string
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_days?: number
          features?: Json
          id?: string
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          created_by: string | null
          end_date: string | null
          id: string
          plan_type: string
          start_date: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: string
          plan_type?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: string
          plan_type?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: string | null
          last_activity: string | null
          session_token: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: string | null
          last_activity?: string | null
          session_token: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          last_activity?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          abonnement_actif: boolean | null
          created_at: string
          date_creation: string
          date_expiration: string | null
          device_info: Json | null
          email: string | null
          id: string
          is_online: boolean | null
          jours_restants: number | null
          last_login: string | null
          login_count: number | null
          nom: string
          password_hash: string
          role: string
          statut: string
          subscription_expires_at: string | null
          subscription_status: string | null
          subscription_type: string | null
          updated_at: string
          username: string
        }
        Insert: {
          abonnement_actif?: boolean | null
          created_at?: string
          date_creation?: string
          date_expiration?: string | null
          device_info?: Json | null
          email?: string | null
          id?: string
          is_online?: boolean | null
          jours_restants?: number | null
          last_login?: string | null
          login_count?: number | null
          nom: string
          password_hash: string
          role?: string
          statut?: string
          subscription_expires_at?: string | null
          subscription_status?: string | null
          subscription_type?: string | null
          updated_at?: string
          username: string
        }
        Update: {
          abonnement_actif?: boolean | null
          created_at?: string
          date_creation?: string
          date_expiration?: string | null
          device_info?: Json | null
          email?: string | null
          id?: string
          is_online?: boolean | null
          jours_restants?: number | null
          last_login?: string | null
          login_count?: number | null
          nom?: string
          password_hash?: string
          role?: string
          statut?: string
          subscription_expires_at?: string | null
          subscription_status?: string | null
          subscription_type?: string | null
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_user_login: {
        Args: { user_id: string }
        Returns: boolean
      }
      check_user_subscription_status: {
        Args: { p_user_id: string }
        Returns: {
          is_active: boolean
          plan_type: string
          days_remaining: number
        }[]
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_user_session: {
        Args: {
          p_username: string
          p_password: string
          p_ip_address?: string
          p_user_agent?: string
        }
        Returns: {
          success: boolean
          message: string
          session_token: string
          user_data: Json
        }[]
      }
      create_user_with_subscription: {
        Args: {
          p_username: string
          p_nom: string
          p_email: string
          p_password: string
          p_plan_type?: string
          p_duration_days?: number
          p_admin_id?: string
        }
        Returns: {
          success: boolean
          message: string
          user_id: string
        }[]
      }
      generate_activation_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_active_subscription: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      hash_password: {
        Args: { password: string }
        Returns: string
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      logout_session: {
        Args: { p_session_token: string }
        Returns: boolean
      }
      use_activation_code: {
        Args: {
          p_code: string
          p_username: string
          p_nom: string
          p_email: string
          p_password: string
        }
        Returns: {
          success: boolean
          message: string
          user_id: string
          user_data: Json
        }[]
      }
      validate_session: {
        Args: { p_session_token: string }
        Returns: {
          valid: boolean
          user_data: Json
        }[]
      }
      verify_password: {
        Args: { password: string; hash: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
