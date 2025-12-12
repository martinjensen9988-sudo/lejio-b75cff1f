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
      admin_messages: {
        Row: {
          appeal_id: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          recipient_id: string | null
          recipient_type: string | null
          sender_id: string
          sender_type: string
          warning_id: string | null
        }
        Insert: {
          appeal_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          recipient_id?: string | null
          recipient_type?: string | null
          sender_id: string
          sender_type: string
          warning_id?: string | null
        }
        Update: {
          appeal_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          recipient_id?: string | null
          recipient_type?: string | null
          sender_id?: string
          sender_type?: string
          warning_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_messages_appeal_id_fkey"
            columns: ["appeal_id"]
            isOneToOne: false
            referencedRelation: "warning_appeals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_messages_warning_id_fkey"
            columns: ["warning_id"]
            isOneToOne: false
            referencedRelation: "renter_warnings"
            referencedColumns: ["id"]
          },
        ]
      }
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
          fuel_fee: number | null
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
          fuel_fee?: number | null
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
          fuel_fee?: number | null
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
      contact_submissions: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          responded_at: string | null
          responded_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
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
          fuel_missing_fee: number | null
          fuel_policy_enabled: boolean | null
          fuel_price_per_liter: number | null
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
          logo_url: string | null
          pdf_url: string | null
          renter_address: string | null
          renter_email: string
          renter_id: string | null
          renter_license_number: string | null
          renter_name: string
          renter_phone: string | null
          renter_signature: string | null
          renter_signed_at: string | null
          roadside_assistance_phone: string | null
          roadside_assistance_provider: string | null
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
          fuel_missing_fee?: number | null
          fuel_policy_enabled?: boolean | null
          fuel_price_per_liter?: number | null
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
          logo_url?: string | null
          pdf_url?: string | null
          renter_address?: string | null
          renter_email: string
          renter_id?: string | null
          renter_license_number?: string | null
          renter_name: string
          renter_phone?: string | null
          renter_signature?: string | null
          renter_signed_at?: string | null
          roadside_assistance_phone?: string | null
          roadside_assistance_provider?: string | null
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
          fuel_missing_fee?: number | null
          fuel_policy_enabled?: boolean | null
          fuel_price_per_liter?: number | null
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
          logo_url?: string | null
          pdf_url?: string | null
          renter_address?: string | null
          renter_email?: string
          renter_id?: string | null
          renter_license_number?: string | null
          renter_name?: string
          renter_phone?: string | null
          renter_signature?: string | null
          renter_signed_at?: string | null
          roadside_assistance_phone?: string | null
          roadside_assistance_provider?: string | null
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
      conversations: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          is_customer_service: boolean
          participant_one: string
          participant_two: string | null
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          is_customer_service?: boolean
          participant_one: string
          participant_two?: string | null
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          is_customer_service?: boolean
          participant_one?: string
          participant_two?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      damage_items: {
        Row: {
          created_at: string
          damage_report_id: string
          damage_type: string
          description: string | null
          id: string
          photo_url: string | null
          position: string
          severity: string
        }
        Insert: {
          created_at?: string
          damage_report_id: string
          damage_type: string
          description?: string | null
          id?: string
          photo_url?: string | null
          position: string
          severity: string
        }
        Update: {
          created_at?: string
          damage_report_id?: string
          damage_type?: string
          description?: string | null
          id?: string
          photo_url?: string | null
          position?: string
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "damage_items_damage_report_id_fkey"
            columns: ["damage_report_id"]
            isOneToOne: false
            referencedRelation: "damage_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      damage_reports: {
        Row: {
          booking_id: string
          contract_id: string | null
          created_at: string
          exterior_clean: boolean | null
          fuel_level: string | null
          id: string
          interior_clean: boolean | null
          notes: string | null
          odometer_reading: number | null
          report_type: string
          reported_by: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          booking_id: string
          contract_id?: string | null
          created_at?: string
          exterior_clean?: boolean | null
          fuel_level?: string | null
          id?: string
          interior_clean?: boolean | null
          notes?: string | null
          odometer_reading?: number | null
          report_type: string
          reported_by: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          booking_id?: string
          contract_id?: string | null
          created_at?: string
          exterior_clean?: boolean | null
          fuel_level?: string | null
          id?: string
          interior_clean?: boolean | null
          notes?: string | null
          odometer_reading?: number | null
          report_type?: string
          reported_by?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "damage_reports_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "damage_reports_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "damage_reports_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "damage_reports_vehicle_id_fkey"
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
      fleet_settlements: {
        Row: {
          bookings_count: number
          commission_amount: number
          commission_rate: number
          created_at: string
          id: string
          lessor_id: string
          net_payout: number
          paid_at: string | null
          settlement_month: string
          status: string
          total_revenue: number
          updated_at: string
        }
        Insert: {
          bookings_count?: number
          commission_amount?: number
          commission_rate: number
          created_at?: string
          id?: string
          lessor_id: string
          net_payout?: number
          paid_at?: string | null
          settlement_month: string
          status?: string
          total_revenue?: number
          updated_at?: string
        }
        Update: {
          bookings_count?: number
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          id?: string
          lessor_id?: string
          net_payout?: number
          paid_at?: string | null
          settlement_month?: string
          status?: string
          total_revenue?: number
          updated_at?: string
        }
        Relationships: []
      }
      gps_data_points: {
        Row: {
          altitude: number | null
          battery_level: number | null
          created_at: string
          device_id: string
          fuel_level: number | null
          heading: number | null
          id: string
          ignition_on: boolean | null
          latitude: number
          longitude: number
          odometer: number | null
          raw_data: Json | null
          recorded_at: string
          speed: number | null
        }
        Insert: {
          altitude?: number | null
          battery_level?: number | null
          created_at?: string
          device_id: string
          fuel_level?: number | null
          heading?: number | null
          id?: string
          ignition_on?: boolean | null
          latitude: number
          longitude: number
          odometer?: number | null
          raw_data?: Json | null
          recorded_at?: string
          speed?: number | null
        }
        Update: {
          altitude?: number | null
          battery_level?: number | null
          created_at?: string
          device_id?: string
          fuel_level?: number | null
          heading?: number | null
          id?: string
          ignition_on?: boolean | null
          latitude?: number
          longitude?: number
          odometer?: number | null
          raw_data?: Json | null
          recorded_at?: string
          speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gps_data_points_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "gps_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      gps_devices: {
        Row: {
          created_at: string
          device_id: string
          device_name: string | null
          id: string
          is_active: boolean
          last_seen_at: string | null
          provider: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          device_id: string
          device_name?: string | null
          id?: string
          is_active?: boolean
          last_seen_at?: string | null
          provider?: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          device_id?: string
          device_name?: string | null
          id?: string
          is_active?: boolean
          last_seen_at?: string | null
          provider?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gps_devices_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gps_devices_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
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
      lessor_ratings: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          lessor_id: string
          rating: number
          renter_id: string
          review_text: string | null
          updated_at: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          lessor_id: string
          rating: number
          renter_id: string
          review_text?: string | null
          updated_at?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          lessor_id?: string
          rating?: number
          renter_id?: string
          review_text?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessor_ratings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      lessor_reports: {
        Row: {
          admin_notes: string | null
          booking_id: string | null
          created_at: string
          description: string
          id: string
          lessor_id: string
          reason: string
          reporter_email: string
          reporter_name: string | null
          reporter_phone: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          severity: number
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          booking_id?: string | null
          created_at?: string
          description: string
          id?: string
          lessor_id: string
          reason: string
          reporter_email: string
          reporter_name?: string | null
          reporter_phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: number
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          booking_id?: string | null
          created_at?: string
          description?: string
          id?: string
          lessor_id?: string
          reason?: string
          reporter_email?: string
          reporter_name?: string | null
          reporter_phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessor_reports_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      live_chat_settings: {
        Row: {
          id: string
          is_live_chat_active: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          is_live_chat_active?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          is_live_chat_active?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_from_support: boolean
          is_read: boolean
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_from_support?: boolean
          is_read?: boolean
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_from_support?: boolean
          is_read?: boolean
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
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
          account_banned_at: string | null
          account_banned_reason: string | null
          account_paused_at: string | null
          account_paused_reason: string | null
          account_status: string
          address: string | null
          avatar_url: string | null
          average_rating: number | null
          bank_account_number: string | null
          bank_reg_number: string | null
          city: string | null
          company_logo_url: string | null
          company_name: string | null
          created_at: string
          cvr_number: string | null
          email: string
          fleet_commission_rate: number | null
          fleet_plan: Database["public"]["Enums"]["fleet_plan_type"] | null
          fuel_missing_fee: number | null
          fuel_policy_enabled: boolean | null
          fuel_price_per_liter: number | null
          full_name: string | null
          id: string
          insurance_company: string | null
          insurance_policy_number: string | null
          lessor_status: Database["public"]["Enums"]["lessor_status"] | null
          manual_activation: boolean | null
          manual_activation_notes: string | null
          mobilepay_number: string | null
          payment_gateway: string | null
          per_booking_fee: number | null
          phone: string | null
          postal_code: string | null
          roadside_assistance_phone: string | null
          roadside_assistance_provider: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_ends_at: string | null
          subscription_started_at: string | null
          subscription_status: string
          subscription_tier: string | null
          total_rating_count: number | null
          total_rating_sum: number | null
          trial_ends_at: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          accepted_payment_methods?: string[] | null
          account_banned_at?: string | null
          account_banned_reason?: string | null
          account_paused_at?: string | null
          account_paused_reason?: string | null
          account_status?: string
          address?: string | null
          avatar_url?: string | null
          average_rating?: number | null
          bank_account_number?: string | null
          bank_reg_number?: string | null
          city?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          created_at?: string
          cvr_number?: string | null
          email: string
          fleet_commission_rate?: number | null
          fleet_plan?: Database["public"]["Enums"]["fleet_plan_type"] | null
          fuel_missing_fee?: number | null
          fuel_policy_enabled?: boolean | null
          fuel_price_per_liter?: number | null
          full_name?: string | null
          id: string
          insurance_company?: string | null
          insurance_policy_number?: string | null
          lessor_status?: Database["public"]["Enums"]["lessor_status"] | null
          manual_activation?: boolean | null
          manual_activation_notes?: string | null
          mobilepay_number?: string | null
          payment_gateway?: string | null
          per_booking_fee?: number | null
          phone?: string | null
          postal_code?: string | null
          roadside_assistance_phone?: string | null
          roadside_assistance_provider?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_started_at?: string | null
          subscription_status?: string
          subscription_tier?: string | null
          total_rating_count?: number | null
          total_rating_sum?: number | null
          trial_ends_at?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          accepted_payment_methods?: string[] | null
          account_banned_at?: string | null
          account_banned_reason?: string | null
          account_paused_at?: string | null
          account_paused_reason?: string | null
          account_status?: string
          address?: string | null
          avatar_url?: string | null
          average_rating?: number | null
          bank_account_number?: string | null
          bank_reg_number?: string | null
          city?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          created_at?: string
          cvr_number?: string | null
          email?: string
          fleet_commission_rate?: number | null
          fleet_plan?: Database["public"]["Enums"]["fleet_plan_type"] | null
          fuel_missing_fee?: number | null
          fuel_policy_enabled?: boolean | null
          fuel_price_per_liter?: number | null
          full_name?: string | null
          id?: string
          insurance_company?: string | null
          insurance_policy_number?: string | null
          lessor_status?: Database["public"]["Enums"]["lessor_status"] | null
          manual_activation?: boolean | null
          manual_activation_notes?: string | null
          mobilepay_number?: string | null
          payment_gateway?: string | null
          per_booking_fee?: number | null
          phone?: string | null
          postal_code?: string | null
          roadside_assistance_phone?: string | null
          roadside_assistance_provider?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_started_at?: string | null
          subscription_status?: string
          subscription_tier?: string | null
          total_rating_count?: number | null
          total_rating_sum?: number | null
          trial_ends_at?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recurring_rentals: {
        Row: {
          billing_day: number
          booking_id: string
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string
          deposit_amount: number | null
          extra_km_price: number | null
          id: string
          included_km: number | null
          last_renewal_at: string | null
          last_renewal_booking_id: string | null
          lessor_id: string
          monthly_price: number
          next_billing_date: string
          paused_at: string | null
          renter_email: string
          renter_id: string | null
          renter_name: string | null
          renter_phone: string | null
          started_at: string
          status: string
          total_renewals: number | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          billing_day?: number
          booking_id: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          deposit_amount?: number | null
          extra_km_price?: number | null
          id?: string
          included_km?: number | null
          last_renewal_at?: string | null
          last_renewal_booking_id?: string | null
          lessor_id: string
          monthly_price: number
          next_billing_date: string
          paused_at?: string | null
          renter_email: string
          renter_id?: string | null
          renter_name?: string | null
          renter_phone?: string | null
          started_at?: string
          status?: string
          total_renewals?: number | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          billing_day?: number
          booking_id?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          deposit_amount?: number | null
          extra_km_price?: number | null
          id?: string
          included_km?: number | null
          last_renewal_at?: string | null
          last_renewal_booking_id?: string | null
          lessor_id?: string
          monthly_price?: number
          next_billing_date?: string
          paused_at?: string | null
          renter_email?: string
          renter_id?: string | null
          renter_name?: string | null
          renter_phone?: string | null
          started_at?: string
          status?: string
          total_renewals?: number | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_rentals_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_rentals_last_renewal_booking_id_fkey"
            columns: ["last_renewal_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_rentals_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_rentals_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      renter_ratings: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          lessor_id: string
          rating: number
          renter_email: string
          renter_id: string | null
          renter_name: string | null
          review_text: string | null
          updated_at: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          lessor_id: string
          rating: number
          renter_email: string
          renter_id?: string | null
          renter_name?: string | null
          review_text?: string | null
          updated_at?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          lessor_id?: string
          rating?: number
          renter_email?: string
          renter_id?: string | null
          renter_name?: string | null
          review_text?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "renter_ratings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      renter_warnings: {
        Row: {
          booking_id: string | null
          created_at: string
          damage_amount: number | null
          description: string
          expires_at: string
          id: string
          reason: Database["public"]["Enums"]["warning_reason"]
          renter_email: string
          renter_license_number: string | null
          renter_name: string | null
          renter_phone: string | null
          reported_by: string
          severity: number
          status: Database["public"]["Enums"]["warning_status"]
          unpaid_amount: number | null
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          damage_amount?: number | null
          description: string
          expires_at?: string
          id?: string
          reason: Database["public"]["Enums"]["warning_reason"]
          renter_email: string
          renter_license_number?: string | null
          renter_name?: string | null
          renter_phone?: string | null
          reported_by: string
          severity?: number
          status?: Database["public"]["Enums"]["warning_status"]
          unpaid_amount?: number | null
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          damage_amount?: number | null
          description?: string
          expires_at?: string
          id?: string
          reason?: Database["public"]["Enums"]["warning_reason"]
          renter_email?: string
          renter_license_number?: string | null
          renter_name?: string | null
          renter_phone?: string | null
          reported_by?: string
          severity?: number
          status?: Database["public"]["Enums"]["warning_status"]
          unpaid_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "renter_warnings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
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
          latitude: number | null
          location_address: string | null
          location_city: string | null
          location_postal_code: string | null
          longitude: number | null
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
          use_custom_location: boolean
          value_documentation_requested: boolean | null
          value_documentation_requested_at: string | null
          value_verification_notes: string | null
          value_verified: boolean | null
          value_verified_at: string | null
          value_verified_by: string | null
          variant: string | null
          vehicle_value: number | null
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
          latitude?: number | null
          location_address?: string | null
          location_city?: string | null
          location_postal_code?: string | null
          longitude?: number | null
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
          use_custom_location?: boolean
          value_documentation_requested?: boolean | null
          value_documentation_requested_at?: string | null
          value_verification_notes?: string | null
          value_verified?: boolean | null
          value_verified_at?: string | null
          value_verified_by?: string | null
          variant?: string | null
          vehicle_value?: number | null
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
          latitude?: number | null
          location_address?: string | null
          location_city?: string | null
          location_postal_code?: string | null
          longitude?: number | null
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
          use_custom_location?: boolean
          value_documentation_requested?: boolean | null
          value_documentation_requested_at?: string | null
          value_verification_notes?: string | null
          value_verified?: boolean | null
          value_verified_at?: string | null
          value_verified_by?: string | null
          variant?: string | null
          vehicle_value?: number | null
          vin?: string | null
          weekly_price?: number | null
          year?: number | null
        }
        Relationships: []
      }
      visitor_chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          sender_type: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sender_type: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sender_type?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visitor_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "visitor_chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      visitor_chat_sessions: {
        Row: {
          assigned_admin_id: string | null
          created_at: string
          id: string
          needs_human_support: boolean
          session_status: string
          updated_at: string
          visitor_email: string | null
          visitor_name: string | null
          visitor_phone: string | null
        }
        Insert: {
          assigned_admin_id?: string | null
          created_at?: string
          id?: string
          needs_human_support?: boolean
          session_status?: string
          updated_at?: string
          visitor_email?: string | null
          visitor_name?: string | null
          visitor_phone?: string | null
        }
        Update: {
          assigned_admin_id?: string | null
          created_at?: string
          id?: string
          needs_human_support?: boolean
          session_status?: string
          updated_at?: string
          visitor_email?: string | null
          visitor_name?: string | null
          visitor_phone?: string | null
        }
        Relationships: []
      }
      warning_appeals: {
        Row: {
          admin_notes: string | null
          appeal_reason: string
          appellant_email: string
          appellant_name: string | null
          created_at: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["appeal_status"]
          supporting_info: string | null
          updated_at: string
          warning_id: string
        }
        Insert: {
          admin_notes?: string | null
          appeal_reason: string
          appellant_email: string
          appellant_name?: string | null
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["appeal_status"]
          supporting_info?: string | null
          updated_at?: string
          warning_id: string
        }
        Update: {
          admin_notes?: string | null
          appeal_reason?: string
          appellant_email?: string
          appellant_name?: string | null
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["appeal_status"]
          supporting_info?: string | null
          updated_at?: string
          warning_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "warning_appeals_warning_id_fkey"
            columns: ["warning_id"]
            isOneToOne: false
            referencedRelation: "renter_warnings"
            referencedColumns: ["id"]
          },
        ]
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
          display_address: string | null
          display_city: string | null
          display_postal_code: string | null
          extra_km_price: number | null
          features: string[] | null
          fuel_type: string | null
          id: string | null
          image_url: string | null
          included_km: number | null
          is_available: boolean | null
          latitude: number | null
          location_address: string | null
          location_city: string | null
          location_postal_code: string | null
          longitude: number | null
          make: string | null
          model: string | null
          monthly_price: number | null
          owner_average_rating: number | null
          owner_company_name: string | null
          owner_fleet_plan:
            | Database["public"]["Enums"]["fleet_plan_type"]
            | null
          owner_lessor_status:
            | Database["public"]["Enums"]["lessor_status"]
            | null
          unlimited_km: boolean | null
          use_custom_location: boolean | null
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
      get_renter_rating_stats: {
        Args: { renter_email_input: string }
        Returns: {
          average_rating: number
          total_ratings: number
        }[]
      }
      get_visitor_chat_messages: {
        Args: { session_id_param: string }
        Returns: {
          content: string
          created_at: string
          id: string
          sender_type: string
          session_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "visitor_chat_messages"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_visitor_chat_session: {
        Args: { session_id_param: string }
        Returns: {
          assigned_admin_id: string | null
          created_at: string
          id: string
          needs_human_support: boolean
          session_status: string
          updated_at: string
          visitor_email: string | null
          visitor_name: string | null
          visitor_phone: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "visitor_chat_sessions"
          isOneToOne: false
          isSetofReturn: true
        }
      }
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
      appeal_status: "pending" | "reviewing" | "approved" | "rejected"
      fleet_plan_type: "fleet_basic" | "fleet_premium"
      lessor_status: "bronze" | "silver" | "gold" | "platinum"
      payment_gateway_type:
        | "stripe"
        | "quickpay"
        | "pensopay"
        | "reepay"
        | "onpay"
      payment_schedule_type: "upfront" | "monthly"
      user_type: "privat" | "professionel"
      warning_reason:
        | "damage"
        | "non_payment"
        | "contract_violation"
        | "fraud"
        | "reckless_driving"
        | "late_return"
        | "cleanliness"
        | "other"
      warning_status: "active" | "under_review" | "dismissed" | "expired"
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
      appeal_status: ["pending", "reviewing", "approved", "rejected"],
      fleet_plan_type: ["fleet_basic", "fleet_premium"],
      lessor_status: ["bronze", "silver", "gold", "platinum"],
      payment_gateway_type: [
        "stripe",
        "quickpay",
        "pensopay",
        "reepay",
        "onpay",
      ],
      payment_schedule_type: ["upfront", "monthly"],
      user_type: ["privat", "professionel"],
      warning_reason: [
        "damage",
        "non_payment",
        "contract_violation",
        "fraud",
        "reckless_driving",
        "late_return",
        "cleanliness",
        "other",
      ],
      warning_status: ["active", "under_review", "dismissed", "expired"],
    },
  },
} as const
