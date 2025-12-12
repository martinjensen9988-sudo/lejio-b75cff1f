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
          extra_driver_birth_date: string | null
          extra_driver_first_name: string | null
          extra_driver_last_name: string | null
          extra_driver_license_country: string | null
          extra_driver_license_issue_date: string | null
          extra_driver_license_number: string | null
          has_extra_driver: boolean | null
          id: string
          lessor_id: string
          notes: string | null
          renter_address: string | null
          renter_birth_date: string | null
          renter_city: string | null
          renter_email: string | null
          renter_first_name: string | null
          renter_id: string | null
          renter_last_name: string | null
          renter_license_country: string | null
          renter_license_issue_date: string | null
          renter_license_number: string | null
          renter_name: string | null
          renter_phone: string | null
          renter_postal_code: string | null
          start_date: string
          status: string
          total_price: number
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          extra_driver_birth_date?: string | null
          extra_driver_first_name?: string | null
          extra_driver_last_name?: string | null
          extra_driver_license_country?: string | null
          extra_driver_license_issue_date?: string | null
          extra_driver_license_number?: string | null
          has_extra_driver?: boolean | null
          id?: string
          lessor_id: string
          notes?: string | null
          renter_address?: string | null
          renter_birth_date?: string | null
          renter_city?: string | null
          renter_email?: string | null
          renter_first_name?: string | null
          renter_id?: string | null
          renter_last_name?: string | null
          renter_license_country?: string | null
          renter_license_issue_date?: string | null
          renter_license_number?: string | null
          renter_name?: string | null
          renter_phone?: string | null
          renter_postal_code?: string | null
          start_date: string
          status?: string
          total_price: number
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          extra_driver_birth_date?: string | null
          extra_driver_first_name?: string | null
          extra_driver_last_name?: string | null
          extra_driver_license_country?: string | null
          extra_driver_license_issue_date?: string | null
          extra_driver_license_number?: string | null
          has_extra_driver?: boolean | null
          id?: string
          lessor_id?: string
          notes?: string | null
          renter_address?: string | null
          renter_birth_date?: string | null
          renter_city?: string | null
          renter_email?: string | null
          renter_first_name?: string | null
          renter_id?: string | null
          renter_last_name?: string | null
          renter_license_country?: string | null
          renter_license_issue_date?: string | null
          renter_license_number?: string | null
          renter_name?: string | null
          renter_phone?: string | null
          renter_postal_code?: string | null
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
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          booking_id: string
          contract_number: string
          contract_type: string
          created_at: string
          daily_price: number
          deductible_amount: number | null
          deposit_amount: number | null
          end_date: string
          extra_km_price: number
          id: string
          included_km: number
          insurance_company: string | null
          insurance_policy_number: string | null
          lessor_address: string | null
          lessor_company_name: string | null
          lessor_cvr: string | null
          lessor_email: string
          lessor_id: string
          lessor_name: string
          lessor_phone: string | null
          lessor_signature: string | null
          lessor_signed_at: string | null
          pdf_url: string | null
          renter_address: string | null
          renter_email: string
          renter_id: string | null
          renter_license_number: string | null
          renter_name: string
          renter_phone: string | null
          renter_signature: string | null
          renter_signed_at: string | null
          start_date: string
          status: string
          total_price: number
          updated_at: string
          vanvidskørsel_accepted: boolean
          vanvidskørsel_liability_amount: number | null
          vehicle_id: string
          vehicle_make: string
          vehicle_model: string
          vehicle_registration: string
          vehicle_value: number | null
          vehicle_vin: string | null
          vehicle_year: number | null
        }
        Insert: {
          booking_id: string
          contract_number: string
          contract_type?: string
          created_at?: string
          daily_price: number
          deductible_amount?: number | null
          deposit_amount?: number | null
          end_date: string
          extra_km_price?: number
          id?: string
          included_km?: number
          insurance_company?: string | null
          insurance_policy_number?: string | null
          lessor_address?: string | null
          lessor_company_name?: string | null
          lessor_cvr?: string | null
          lessor_email: string
          lessor_id: string
          lessor_name: string
          lessor_phone?: string | null
          lessor_signature?: string | null
          lessor_signed_at?: string | null
          pdf_url?: string | null
          renter_address?: string | null
          renter_email: string
          renter_id?: string | null
          renter_license_number?: string | null
          renter_name: string
          renter_phone?: string | null
          renter_signature?: string | null
          renter_signed_at?: string | null
          start_date: string
          status?: string
          total_price: number
          updated_at?: string
          vanvidskørsel_accepted?: boolean
          vanvidskørsel_liability_amount?: number | null
          vehicle_id: string
          vehicle_make: string
          vehicle_model: string
          vehicle_registration: string
          vehicle_value?: number | null
          vehicle_vin?: string | null
          vehicle_year?: number | null
        }
        Update: {
          booking_id?: string
          contract_number?: string
          contract_type?: string
          created_at?: string
          daily_price?: number
          deductible_amount?: number | null
          deposit_amount?: number | null
          end_date?: string
          extra_km_price?: number
          id?: string
          included_km?: number
          insurance_company?: string | null
          insurance_policy_number?: string | null
          lessor_address?: string | null
          lessor_company_name?: string | null
          lessor_cvr?: string | null
          lessor_email?: string
          lessor_id?: string
          lessor_name?: string
          lessor_phone?: string | null
          lessor_signature?: string | null
          lessor_signed_at?: string | null
          pdf_url?: string | null
          renter_address?: string | null
          renter_email?: string
          renter_id?: string | null
          renter_license_number?: string | null
          renter_name?: string
          renter_phone?: string | null
          renter_signature?: string | null
          renter_signed_at?: string | null
          start_date?: string
          status?: string
          total_price?: number
          updated_at?: string
          vanvidskørsel_accepted?: boolean
          vanvidskørsel_liability_amount?: number | null
          vehicle_id?: string
          vehicle_make?: string
          vehicle_model?: string
          vehicle_registration?: string
          vehicle_value?: number | null
          vehicle_vin?: string | null
          vehicle_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_code_redemptions: {
        Row: {
          discount_code_id: string
          id: string
          redeemed_at: string
          user_id: string
        }
        Insert: {
          discount_code_id: string
          id?: string
          redeemed_at?: string
          user_id: string
        }
        Update: {
          discount_code_id?: string
          id?: string
          redeemed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discount_code_redemptions_discount_code_id_fkey"
            columns: ["discount_code_id"]
            isOneToOne: false
            referencedRelation: "discount_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          current_uses: number | null
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          max_uses: number | null
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      lessor_payment_settings: {
        Row: {
          bank_account: string | null
          created_at: string
          gateway_api_key: string | null
          gateway_merchant_id: string | null
          id: string
          lessor_id: string
          payment_gateway: string | null
          updated_at: string
        }
        Insert: {
          bank_account?: string | null
          created_at?: string
          gateway_api_key?: string | null
          gateway_merchant_id?: string | null
          id?: string
          lessor_id: string
          payment_gateway?: string | null
          updated_at?: string
        }
        Update: {
          bank_account?: string | null
          created_at?: string
          gateway_api_key?: string | null
          gateway_merchant_id?: string | null
          id?: string
          lessor_id?: string
          payment_gateway?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          card_brand: string | null
          card_expiry_month: number | null
          card_expiry_year: number | null
          card_last_four: string | null
          created_at: string
          customer_id: string
          gateway: Database["public"]["Enums"]["payment_gateway_type"]
          gateway_payment_method_id: string
          id: string
          is_default: boolean | null
          lessor_id: string
          updated_at: string
        }
        Insert: {
          card_brand?: string | null
          card_expiry_month?: number | null
          card_expiry_year?: number | null
          card_last_four?: string | null
          created_at?: string
          customer_id: string
          gateway: Database["public"]["Enums"]["payment_gateway_type"]
          gateway_payment_method_id: string
          id?: string
          is_default?: boolean | null
          lessor_id: string
          updated_at?: string
        }
        Update: {
          card_brand?: string | null
          card_expiry_month?: number | null
          card_expiry_year?: number | null
          card_last_four?: string | null
          created_at?: string
          customer_id?: string
          gateway?: Database["public"]["Enums"]["payment_gateway_type"]
          gateway_payment_method_id?: string
          id?: string
          is_default?: boolean | null
          lessor_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          currency: string
          description: string | null
          failure_reason: string | null
          gateway: Database["public"]["Enums"]["payment_gateway_type"]
          gateway_transaction_id: string | null
          id: string
          lessor_id: string
          renter_id: string | null
          status: string
          subscription_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          failure_reason?: string | null
          gateway: Database["public"]["Enums"]["payment_gateway_type"]
          gateway_transaction_id?: string | null
          id?: string
          lessor_id: string
          renter_id?: string | null
          status?: string
          subscription_id?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          failure_reason?: string | null
          gateway?: Database["public"]["Enums"]["payment_gateway_type"]
          gateway_transaction_id?: string | null
          id?: string
          lessor_id?: string
          renter_id?: string | null
          status?: string
          subscription_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_fees: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          currency: string
          description: string | null
          id: string
          lessor_id: string
          paid_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          booking_id: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          lessor_id: string
          paid_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          lessor_id?: string
          paid_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_fees_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accepted_payment_methods: string[] | null
          address: string | null
          avatar_url: string | null
          bank_account_number: string | null
          bank_reg_number: string | null
          city: string | null
          company_name: string | null
          created_at: string
          cvr_number: string | null
          email: string
          full_name: string | null
          id: string
          insurance_company: string | null
          insurance_policy_number: string | null
          manual_activation: boolean | null
          manual_activation_notes: string | null
          mobilepay_number: string | null
          payment_gateway: string | null
          per_booking_fee: number | null
          phone: string | null
          postal_code: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_ends_at: string | null
          subscription_started_at: string | null
          subscription_status: string
          subscription_tier: string | null
          trial_ends_at: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          accepted_payment_methods?: string[] | null
          address?: string | null
          avatar_url?: string | null
          bank_account_number?: string | null
          bank_reg_number?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string
          cvr_number?: string | null
          email: string
          full_name?: string | null
          id: string
          insurance_company?: string | null
          insurance_policy_number?: string | null
          manual_activation?: boolean | null
          manual_activation_notes?: string | null
          mobilepay_number?: string | null
          payment_gateway?: string | null
          per_booking_fee?: number | null
          phone?: string | null
          postal_code?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_started_at?: string | null
          subscription_status?: string
          subscription_tier?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          accepted_payment_methods?: string[] | null
          address?: string | null
          avatar_url?: string | null
          bank_account_number?: string | null
          bank_reg_number?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string
          cvr_number?: string | null
          email?: string
          full_name?: string | null
          id?: string
          insurance_company?: string | null
          insurance_policy_number?: string | null
          manual_activation?: boolean | null
          manual_activation_notes?: string | null
          mobilepay_number?: string | null
          payment_gateway?: string | null
          per_booking_fee?: number | null
          phone?: string | null
          postal_code?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_started_at?: string | null
          subscription_status?: string
          subscription_tier?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          booking_id: string
          cancelled_at: string | null
          created_at: string
          currency: string
          current_period_end: string | null
          current_period_start: string | null
          gateway: Database["public"]["Enums"]["payment_gateway_type"]
          gateway_subscription_id: string | null
          id: string
          interval: string
          lessor_id: string
          next_payment_date: string | null
          payment_method_id: string | null
          renter_id: string | null
          status: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          amount: number
          booking_id: string
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          gateway: Database["public"]["Enums"]["payment_gateway_type"]
          gateway_subscription_id?: string | null
          id?: string
          interval?: string
          lessor_id: string
          next_payment_date?: string | null
          payment_method_id?: string | null
          renter_id?: string | null
          status?: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          amount?: number
          booking_id?: string
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          gateway?: Database["public"]["Enums"]["payment_gateway_type"]
          gateway_subscription_id?: string | null
          id?: string
          interval?: string
          lessor_id?: string
          next_payment_date?: string | null
          payment_method_id?: string | null
          renter_id?: string | null
          status?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          color: string | null
          created_at: string
          daily_price: number | null
          deposit_amount: number | null
          deposit_required: boolean
          description: string | null
          extra_km_price: number | null
          features: string[] | null
          fuel_type: string | null
          id: string
          image_url: string | null
          included_km: number | null
          is_available: boolean | null
          make: string
          model: string
          monthly_price: number | null
          owner_id: string
          payment_schedule:
            | Database["public"]["Enums"]["payment_schedule_type"]
            | null
          prepaid_rent_enabled: boolean
          prepaid_rent_months: number | null
          registration: string
          unlimited_km: boolean
          updated_at: string
          variant: string | null
          vin: string | null
          weekly_price: number | null
          year: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          daily_price?: number | null
          deposit_amount?: number | null
          deposit_required?: boolean
          description?: string | null
          extra_km_price?: number | null
          features?: string[] | null
          fuel_type?: string | null
          id?: string
          image_url?: string | null
          included_km?: number | null
          is_available?: boolean | null
          make: string
          model: string
          monthly_price?: number | null
          owner_id: string
          payment_schedule?:
            | Database["public"]["Enums"]["payment_schedule_type"]
            | null
          prepaid_rent_enabled?: boolean
          prepaid_rent_months?: number | null
          registration: string
          unlimited_km?: boolean
          updated_at?: string
          variant?: string | null
          vin?: string | null
          weekly_price?: number | null
          year?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          daily_price?: number | null
          deposit_amount?: number | null
          deposit_required?: boolean
          description?: string | null
          extra_km_price?: number | null
          features?: string[] | null
          fuel_type?: string | null
          id?: string
          image_url?: string | null
          included_km?: number | null
          is_available?: boolean | null
          make?: string
          model?: string
          monthly_price?: number | null
          owner_id?: string
          payment_schedule?:
            | Database["public"]["Enums"]["payment_schedule_type"]
            | null
          prepaid_rent_enabled?: boolean
          prepaid_rent_months?: number | null
          registration?: string
          unlimited_km?: boolean
          updated_at?: string
          variant?: string | null
          vin?: string | null
          weekly_price?: number | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      vehicles_public: {
        Row: {
          color: string | null
          created_at: string | null
          daily_price: number | null
          deposit_amount: number | null
          deposit_required: boolean | null
          description: string | null
          extra_km_price: number | null
          features: string[] | null
          fuel_type: string | null
          id: string | null
          image_url: string | null
          included_km: number | null
          is_available: boolean | null
          make: string | null
          model: string | null
          monthly_price: number | null
          unlimited_km: boolean | null
          variant: string | null
          weekly_price: number | null
          year: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_view_vehicle_sensitive_data: {
        Args: { vehicle_id: string }
        Returns: boolean
      }
      generate_contract_number: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "super_admin"
      payment_gateway_type:
        | "stripe"
        | "quickpay"
        | "pensopay"
        | "reepay"
        | "onpay"
      payment_schedule_type: "upfront" | "monthly"
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
      app_role: ["admin", "super_admin"],
      payment_gateway_type: [
        "stripe",
        "quickpay",
        "pensopay",
        "reepay",
        "onpay",
      ],
      payment_schedule_type: ["upfront", "monthly"],
      user_type: ["privat", "professionel"],
    },
  },
} as const
