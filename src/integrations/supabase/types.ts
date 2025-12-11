export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string
          end_date: string
          id: string
          lessor_id: string
          notes: string | null
          renter_email: string | null
          renter_id: string | null
          renter_name: string | null
          renter_phone: string | null
          start_date: string
          status: string
          total_price: number
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          lessor_id: string
          notes?: string | null
          renter_email?: string | null
          renter_id?: string | null
          renter_name?: string | null
          renter_phone?: string | null
          start_date: string
          status?: string
          total_price: number
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          lessor_id?: string
          notes?: string | null
          renter_email?: string | null
          renter_id?: string | null
          renter_name?: string | null
          renter_phone?: string | null
          start_date?: string
          status?: string
          total_price?: number
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bank_account: string | null
          city: string | null
          company_name: string | null
          created_at: string
          cvr_number: string | null
          email: string
          full_name: string | null
          gateway_api_key: string | null
          gateway_merchant_id: string | null
          id: string
          insurance_company: string | null
          insurance_policy_number: string | null
          payment_gateway: string | null
          phone: string | null
          postal_code: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bank_account?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string
          cvr_number?: string | null
          email: string
          full_name?: string | null
          gateway_api_key?: string | null
          gateway_merchant_id?: string | null
          id: string
          insurance_company?: string | null
          insurance_policy_number?: string | null
          payment_gateway?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bank_account?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string
          cvr_number?: string | null
          email?: string
          full_name?: string | null
          gateway_api_key?: string | null
          gateway_merchant_id?: string | null
          id?: string
          insurance_company?: string | null
          insurance_policy_number?: string | null
          payment_gateway?: string | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          color: string | null
          created_at: string
          daily_price: number | null
          description: string | null
          extra_km_price: number | null
          fuel_type: string | null
          id: string
          included_km: number | null
          is_available: boolean | null
          make: string
          model: string
          owner_id: string
          registration: string
          updated_at: string
          variant: string | null
          vin: string | null
          year: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          daily_price?: number | null
          description?: string | null
          extra_km_price?: number | null
          fuel_type?: string | null
          id?: string
          included_km?: number | null
          is_available?: boolean | null
          make: string
          model: string
          owner_id: string
          registration: string
          updated_at?: string
          variant?: string | null
          vin?: string | null
          year?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          daily_price?: number | null
          description?: string | null
          extra_km_price?: number | null
          fuel_type?: string | null
          id?: string
          included_km?: number | null
          is_available?: boolean | null
          make?: string
          model?: string
          owner_id?: string
          registration?: string
          updated_at?: string
          variant?: string | null
          vin?: string | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type: "privat" | "professionel"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_type: ["privat", "professionel"],
    },
  },
} as const
