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
      admin_audit_logs: {
        Row: {
          action_type: string
          admin_user_id: string
          created_at: string
          description: string
          entity_id: string | null
          entity_identifier: string | null
          entity_type: string
          id: string
          ip_address: string | null
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_user_id: string
          created_at?: string
          description: string
          entity_id?: string | null
          entity_identifier?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string
          created_at?: string
          description?: string
          entity_id?: string | null
          entity_identifier?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
        }
        Relationships: []
      }
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
      booking_deductible_selections: {
        Row: {
          booking_id: string
          created_at: string | null
          daily_premium_paid: number | null
          deductible_amount: number
          deductible_profile_id: string | null
          id: string
          selected_tier: string
          total_premium_paid: number | null
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          daily_premium_paid?: number | null
          deductible_amount: number
          deductible_profile_id?: string | null
          id?: string
          selected_tier?: string
          total_premium_paid?: number | null
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          daily_premium_paid?: number | null
          deductible_amount?: number
          deductible_profile_id?: string | null
          id?: string
          selected_tier?: string
          total_premium_paid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_deductible_selections_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_deductible_selections_deductible_profile_id_fkey"
            columns: ["deductible_profile_id"]
            isOneToOne: false
            referencedRelation: "deductible_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          actual_dropoff_time: string | null
          base_price: number | null
          created_at: string
          daily_price: number | null
          deductible_insurance_price: number | null
          deductible_insurance_selected: boolean | null
          deposit_amount: number | null
          dropoff_location_id: string | null
          dropoff_time: string | null
          end_date: string
          extra_driver_birth_date: string | null
          extra_driver_first_name: string | null
          extra_driver_last_name: string | null
          extra_driver_license_country: string | null
          extra_driver_license_issue_date: string | null
          extra_driver_license_number: string | null
          extra_km_price: number | null
          fuel_fee: number | null
          has_extra_driver: boolean | null
          id: string
          included_km: number | null
          late_return_fee: number | null
          lessor_id: string
          monthly_price: number | null
          notes: string | null
          original_deductible: number | null
          payment_method: string | null
          payment_received: boolean | null
          payment_received_at: string | null
          period_count: number | null
          period_type: string | null
          pickup_location_id: string | null
          pickup_time: string | null
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
          unlimited_km: boolean | null
          updated_at: string
          vehicle_id: string
          weekly_price: number | null
        }
        Insert: {
          actual_dropoff_time?: string | null
          base_price?: number | null
          created_at?: string
          daily_price?: number | null
          deductible_insurance_price?: number | null
          deductible_insurance_selected?: boolean | null
          deposit_amount?: number | null
          dropoff_location_id?: string | null
          dropoff_time?: string | null
          end_date: string
          extra_driver_birth_date?: string | null
          extra_driver_first_name?: string | null
          extra_driver_last_name?: string | null
          extra_driver_license_country?: string | null
          extra_driver_license_issue_date?: string | null
          extra_driver_license_number?: string | null
          extra_km_price?: number | null
          fuel_fee?: number | null
          has_extra_driver?: boolean | null
          id?: string
          included_km?: number | null
          late_return_fee?: number | null
          lessor_id: string
          monthly_price?: number | null
          notes?: string | null
          original_deductible?: number | null
          payment_method?: string | null
          payment_received?: boolean | null
          payment_received_at?: string | null
          period_count?: number | null
          period_type?: string | null
          pickup_location_id?: string | null
          pickup_time?: string | null
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
          unlimited_km?: boolean | null
          updated_at?: string
          vehicle_id: string
          weekly_price?: number | null
        }
        Update: {
          actual_dropoff_time?: string | null
          base_price?: number | null
          created_at?: string
          daily_price?: number | null
          deductible_insurance_price?: number | null
          deductible_insurance_selected?: boolean | null
          deposit_amount?: number | null
          dropoff_location_id?: string | null
          dropoff_time?: string | null
          end_date?: string
          extra_driver_birth_date?: string | null
          extra_driver_first_name?: string | null
          extra_driver_last_name?: string | null
          extra_driver_license_country?: string | null
          extra_driver_license_issue_date?: string | null
          extra_driver_license_number?: string | null
          extra_km_price?: number | null
          fuel_fee?: number | null
          has_extra_driver?: boolean | null
          id?: string
          included_km?: number | null
          late_return_fee?: number | null
          lessor_id?: string
          monthly_price?: number | null
          notes?: string | null
          original_deductible?: number | null
          payment_method?: string | null
          payment_received?: boolean | null
          payment_received_at?: string | null
          period_count?: number | null
          period_type?: string | null
          pickup_location_id?: string | null
          pickup_time?: string | null
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
          unlimited_km?: boolean | null
          updated_at?: string
          vehicle_id?: string
          weekly_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_dropoff_location_id_fkey"
            columns: ["dropoff_location_id"]
            isOneToOne: false
            referencedRelation: "dealer_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_pickup_location_id_fkey"
            columns: ["pickup_location_id"]
            isOneToOne: false
            referencedRelation: "dealer_locations"
            referencedColumns: ["id"]
          },
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
      check_in_out_records: {
        Row: {
          ai_detected_fuel_percent: number | null
          ai_detected_odometer: number | null
          booking_id: string
          captured_at: string
          confirmed_fuel_percent: number | null
          confirmed_odometer: number | null
          created_at: string
          dashboard_image_url: string | null
          expected_latitude: number | null
          expected_longitude: number | null
          expected_plate: string
          exterior_clean: boolean | null
          exterior_cleaning_fee: number | null
          fuel_end_percent: number | null
          fuel_fee: number | null
          fuel_missing_liters: number | null
          fuel_start_percent: number | null
          id: string
          interior_clean: boolean | null
          interior_cleaning_fee: number | null
          km_driven: number | null
          km_included: number | null
          km_overage: number | null
          km_overage_fee: number | null
          km_overage_rate: number | null
          latitude: number | null
          lessor_id: string
          location_distance_km: number | null
          location_verified: boolean | null
          longitude: number | null
          manual_correction_reason: string | null
          plate_scan_image_url: string | null
          plate_verified: boolean | null
          record_type: string
          renter_id: string | null
          requires_review: boolean | null
          scanned_plate: string | null
          server_timestamp: string
          settlement_status: string | null
          total_extra_charges: number | null
          updated_at: string
          vehicle_id: string
          was_manually_corrected: boolean | null
        }
        Insert: {
          ai_detected_fuel_percent?: number | null
          ai_detected_odometer?: number | null
          booking_id: string
          captured_at?: string
          confirmed_fuel_percent?: number | null
          confirmed_odometer?: number | null
          created_at?: string
          dashboard_image_url?: string | null
          expected_latitude?: number | null
          expected_longitude?: number | null
          expected_plate: string
          exterior_clean?: boolean | null
          exterior_cleaning_fee?: number | null
          fuel_end_percent?: number | null
          fuel_fee?: number | null
          fuel_missing_liters?: number | null
          fuel_start_percent?: number | null
          id?: string
          interior_clean?: boolean | null
          interior_cleaning_fee?: number | null
          km_driven?: number | null
          km_included?: number | null
          km_overage?: number | null
          km_overage_fee?: number | null
          km_overage_rate?: number | null
          latitude?: number | null
          lessor_id: string
          location_distance_km?: number | null
          location_verified?: boolean | null
          longitude?: number | null
          manual_correction_reason?: string | null
          plate_scan_image_url?: string | null
          plate_verified?: boolean | null
          record_type: string
          renter_id?: string | null
          requires_review?: boolean | null
          scanned_plate?: string | null
          server_timestamp?: string
          settlement_status?: string | null
          total_extra_charges?: number | null
          updated_at?: string
          vehicle_id: string
          was_manually_corrected?: boolean | null
        }
        Update: {
          ai_detected_fuel_percent?: number | null
          ai_detected_odometer?: number | null
          booking_id?: string
          captured_at?: string
          confirmed_fuel_percent?: number | null
          confirmed_odometer?: number | null
          created_at?: string
          dashboard_image_url?: string | null
          expected_latitude?: number | null
          expected_longitude?: number | null
          expected_plate?: string
          exterior_clean?: boolean | null
          exterior_cleaning_fee?: number | null
          fuel_end_percent?: number | null
          fuel_fee?: number | null
          fuel_missing_liters?: number | null
          fuel_start_percent?: number | null
          id?: string
          interior_clean?: boolean | null
          interior_cleaning_fee?: number | null
          km_driven?: number | null
          km_included?: number | null
          km_overage?: number | null
          km_overage_fee?: number | null
          km_overage_rate?: number | null
          latitude?: number | null
          lessor_id?: string
          location_distance_km?: number | null
          location_verified?: boolean | null
          longitude?: number | null
          manual_correction_reason?: string | null
          plate_scan_image_url?: string | null
          plate_verified?: boolean | null
          record_type?: string
          renter_id?: string | null
          requires_review?: boolean | null
          scanned_plate?: string | null
          server_timestamp?: string
          settlement_status?: string | null
          total_extra_charges?: number | null
          updated_at?: string
          vehicle_id?: string
          was_manually_corrected?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "check_in_out_records_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "check_in_out_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "check_in_out_records_vehicle_id_fkey"
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
          deductible_insurance_price: number | null
          deductible_insurance_selected: boolean | null
          deposit_amount: number | null
          dropoff_time: string | null
          end_date: string
          exterior_cleaning_fee: number | null
          extra_km_price: number
          fuel_missing_fee: number | null
          fuel_policy_enabled: boolean | null
          fuel_price_per_liter: number | null
          id: string
          included_km: number
          insurance_company: string | null
          insurance_policy_number: string | null
          interior_cleaning_fee: number | null
          late_return_fee_enabled: boolean | null
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
          pickup_location_address: string | null
          pickup_location_name: string | null
          pickup_location_phone: string | null
          pickup_time: string | null
          renter_address: string | null
          renter_birth_date: string | null
          renter_city: string | null
          renter_email: string
          renter_id: string | null
          renter_license_country: string | null
          renter_license_issue_date: string | null
          renter_license_number: string | null
          renter_name: string
          renter_phone: string | null
          renter_postal_code: string | null
          renter_signature: string | null
          renter_signed_at: string | null
          renter_street_address: string | null
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
          deductible_insurance_price?: number | null
          deductible_insurance_selected?: boolean | null
          deposit_amount?: number | null
          dropoff_time?: string | null
          end_date: string
          exterior_cleaning_fee?: number | null
          extra_km_price?: number
          fuel_missing_fee?: number | null
          fuel_policy_enabled?: boolean | null
          fuel_price_per_liter?: number | null
          id?: string
          included_km?: number
          insurance_company?: string | null
          insurance_policy_number?: string | null
          interior_cleaning_fee?: number | null
          late_return_fee_enabled?: boolean | null
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
          pickup_location_address?: string | null
          pickup_location_name?: string | null
          pickup_location_phone?: string | null
          pickup_time?: string | null
          renter_address?: string | null
          renter_birth_date?: string | null
          renter_city?: string | null
          renter_email: string
          renter_id?: string | null
          renter_license_country?: string | null
          renter_license_issue_date?: string | null
          renter_license_number?: string | null
          renter_name: string
          renter_phone?: string | null
          renter_postal_code?: string | null
          renter_signature?: string | null
          renter_signed_at?: string | null
          renter_street_address?: string | null
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
          deductible_insurance_price?: number | null
          deductible_insurance_selected?: boolean | null
          deposit_amount?: number | null
          dropoff_time?: string | null
          end_date?: string
          exterior_cleaning_fee?: number | null
          extra_km_price?: number
          fuel_missing_fee?: number | null
          fuel_policy_enabled?: boolean | null
          fuel_price_per_liter?: number | null
          id?: string
          included_km?: number
          insurance_company?: string | null
          insurance_policy_number?: string | null
          interior_cleaning_fee?: number | null
          late_return_fee_enabled?: boolean | null
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
          pickup_location_address?: string | null
          pickup_location_name?: string | null
          pickup_location_phone?: string | null
          pickup_time?: string | null
          renter_address?: string | null
          renter_birth_date?: string | null
          renter_city?: string | null
          renter_email?: string
          renter_id?: string | null
          renter_license_country?: string | null
          renter_license_issue_date?: string | null
          renter_license_number?: string | null
          renter_name?: string
          renter_phone?: string | null
          renter_postal_code?: string | null
          renter_signature?: string | null
          renter_signed_at?: string | null
          renter_street_address?: string | null
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
      corporate_accounts: {
        Row: {
          billing_address: string | null
          billing_city: string | null
          billing_postal_code: string | null
          commission_rate: number | null
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone: string | null
          contract_end_date: string | null
          contract_start_date: string | null
          created_at: string | null
          cvr_number: string
          ean_number: string | null
          id: string
          monthly_budget: number | null
          notes: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          billing_address?: string | null
          billing_city?: string | null
          billing_postal_code?: string | null
          commission_rate?: number | null
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          cvr_number: string
          ean_number?: string | null
          id?: string
          monthly_budget?: number | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_address?: string | null
          billing_city?: string | null
          billing_postal_code?: string | null
          commission_rate?: number | null
          company_name?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          created_at?: string | null
          cvr_number?: string
          ean_number?: string | null
          id?: string
          monthly_budget?: number | null
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      corporate_bookings: {
        Row: {
          booking_id: string
          corporate_account_id: string
          corporate_employee_id: string
          cost_allocated: number | null
          created_at: string | null
          department_id: string | null
          destination: string | null
          fleet_vehicle_id: string | null
          id: string
          km_driven: number | null
          purpose: string | null
        }
        Insert: {
          booking_id: string
          corporate_account_id: string
          corporate_employee_id: string
          cost_allocated?: number | null
          created_at?: string | null
          department_id?: string | null
          destination?: string | null
          fleet_vehicle_id?: string | null
          id?: string
          km_driven?: number | null
          purpose?: string | null
        }
        Update: {
          booking_id?: string
          corporate_account_id?: string
          corporate_employee_id?: string
          cost_allocated?: number | null
          created_at?: string | null
          department_id?: string | null
          destination?: string | null
          fleet_vehicle_id?: string | null
          id?: string
          km_driven?: number | null
          purpose?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "corporate_bookings_corporate_account_id_fkey"
            columns: ["corporate_account_id"]
            isOneToOne: false
            referencedRelation: "corporate_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corporate_bookings_corporate_employee_id_fkey"
            columns: ["corporate_employee_id"]
            isOneToOne: false
            referencedRelation: "corporate_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corporate_bookings_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "corporate_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corporate_bookings_fleet_vehicle_id_fkey"
            columns: ["fleet_vehicle_id"]
            isOneToOne: false
            referencedRelation: "corporate_fleet_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_departments: {
        Row: {
          corporate_account_id: string
          cost_center_code: string | null
          created_at: string | null
          id: string
          monthly_budget: number | null
          name: string
        }
        Insert: {
          corporate_account_id: string
          cost_center_code?: string | null
          created_at?: string | null
          id?: string
          monthly_budget?: number | null
          name: string
        }
        Update: {
          corporate_account_id?: string
          cost_center_code?: string | null
          created_at?: string | null
          id?: string
          monthly_budget?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "corporate_departments_corporate_account_id_fkey"
            columns: ["corporate_account_id"]
            isOneToOne: false
            referencedRelation: "corporate_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_employees: {
        Row: {
          corporate_account_id: string
          created_at: string | null
          department_id: string | null
          driver_license_verified: boolean | null
          email: string
          employee_number: string | null
          full_name: string
          id: string
          is_active: boolean | null
          is_admin: boolean | null
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          corporate_account_id: string
          created_at?: string | null
          department_id?: string | null
          driver_license_verified?: boolean | null
          email: string
          employee_number?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          is_admin?: boolean | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          corporate_account_id?: string
          created_at?: string | null
          department_id?: string | null
          driver_license_verified?: boolean | null
          email?: string
          employee_number?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          is_admin?: boolean | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "corporate_employees_corporate_account_id_fkey"
            columns: ["corporate_account_id"]
            isOneToOne: false
            referencedRelation: "corporate_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corporate_employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "corporate_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_fleet_vehicles: {
        Row: {
          assigned_department_id: string | null
          corporate_account_id: string
          created_at: string | null
          end_date: string | null
          extra_km_rate: number | null
          id: string
          included_km_per_month: number | null
          is_exclusive: boolean | null
          lessor_id: string
          monthly_rate: number
          start_date: string
          status: string | null
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          assigned_department_id?: string | null
          corporate_account_id: string
          created_at?: string | null
          end_date?: string | null
          extra_km_rate?: number | null
          id?: string
          included_km_per_month?: number | null
          is_exclusive?: boolean | null
          lessor_id: string
          monthly_rate: number
          start_date: string
          status?: string | null
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          assigned_department_id?: string | null
          corporate_account_id?: string
          created_at?: string | null
          end_date?: string | null
          extra_km_rate?: number | null
          id?: string
          included_km_per_month?: number | null
          is_exclusive?: boolean | null
          lessor_id?: string
          monthly_rate?: number
          start_date?: string
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "corporate_fleet_vehicles_assigned_department_id_fkey"
            columns: ["assigned_department_id"]
            isOneToOne: false
            referencedRelation: "corporate_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corporate_fleet_vehicles_corporate_account_id_fkey"
            columns: ["corporate_account_id"]
            isOneToOne: false
            referencedRelation: "corporate_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_invoices: {
        Row: {
          corporate_account_id: string
          created_at: string | null
          department_breakdown: Json | null
          due_date: string | null
          id: string
          invoice_number: string
          invoice_period_end: string
          invoice_period_start: string
          issued_at: string | null
          line_items: Json | null
          paid_at: string | null
          pdf_url: string | null
          status: string | null
          subtotal: number
          total_amount: number
          total_bookings: number | null
          total_km_driven: number | null
          updated_at: string | null
          vat_amount: number
        }
        Insert: {
          corporate_account_id: string
          created_at?: string | null
          department_breakdown?: Json | null
          due_date?: string | null
          id?: string
          invoice_number: string
          invoice_period_end: string
          invoice_period_start: string
          issued_at?: string | null
          line_items?: Json | null
          paid_at?: string | null
          pdf_url?: string | null
          status?: string | null
          subtotal?: number
          total_amount?: number
          total_bookings?: number | null
          total_km_driven?: number | null
          updated_at?: string | null
          vat_amount?: number
        }
        Update: {
          corporate_account_id?: string
          created_at?: string | null
          department_breakdown?: Json | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          invoice_period_end?: string
          invoice_period_start?: string
          issued_at?: string | null
          line_items?: Json | null
          paid_at?: string | null
          pdf_url?: string | null
          status?: string | null
          subtotal?: number
          total_amount?: number
          total_bookings?: number | null
          total_km_driven?: number | null
          updated_at?: string | null
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "corporate_invoices_corporate_account_id_fkey"
            columns: ["corporate_account_id"]
            isOneToOne: false
            referencedRelation: "corporate_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_usage_stats: {
        Row: {
          avg_utilization_rate: number | null
          co2_emissions_kg: number | null
          corporate_account_id: string
          created_at: string | null
          department_stats: Json | null
          id: string
          most_used_vehicle_id: string | null
          period_month: string
          total_bookings: number | null
          total_cost: number | null
          total_km_driven: number | null
        }
        Insert: {
          avg_utilization_rate?: number | null
          co2_emissions_kg?: number | null
          corporate_account_id: string
          created_at?: string | null
          department_stats?: Json | null
          id?: string
          most_used_vehicle_id?: string | null
          period_month: string
          total_bookings?: number | null
          total_cost?: number | null
          total_km_driven?: number | null
        }
        Update: {
          avg_utilization_rate?: number | null
          co2_emissions_kg?: number | null
          corporate_account_id?: string
          created_at?: string | null
          department_stats?: Json | null
          id?: string
          most_used_vehicle_id?: string | null
          period_month?: string
          total_bookings?: number | null
          total_cost?: number | null
          total_km_driven?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "corporate_usage_stats_corporate_account_id_fkey"
            columns: ["corporate_account_id"]
            isOneToOne: false
            referencedRelation: "corporate_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_segments: {
        Row: {
          created_at: string
          first_booking_at: string | null
          id: string
          last_booking_at: string | null
          lessor_id: string
          notes: string | null
          renter_email: string
          renter_name: string | null
          segment: string
          total_bookings: number
          total_revenue: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_booking_at?: string | null
          id?: string
          last_booking_at?: string | null
          lessor_id: string
          notes?: string | null
          renter_email: string
          renter_name?: string | null
          segment?: string
          total_bookings?: number
          total_revenue?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_booking_at?: string | null
          id?: string
          last_booking_at?: string | null
          lessor_id?: string
          notes?: string | null
          renter_email?: string
          renter_name?: string | null
          segment?: string
          total_bookings?: number
          total_revenue?: number
          updated_at?: string
        }
        Relationships: []
      }
      dagens_bil_settings: {
        Row: {
          auto_rotate: boolean | null
          created_at: string
          id: string
          last_posted_at: string | null
          post_time: string | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          auto_rotate?: boolean | null
          created_at?: string
          id?: string
          last_posted_at?: string | null
          post_time?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          auto_rotate?: boolean | null
          created_at?: string
          id?: string
          last_posted_at?: string | null
          post_time?: string | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dagens_bil_settings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dagens_bil_settings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
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
      dealer_locations: {
        Row: {
          address: string
          city: string
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          is_headquarters: boolean
          latitude: number | null
          longitude: number | null
          name: string
          notes: string | null
          partner_id: string
          phone: string | null
          postal_code: string
          preparation_time_minutes: number
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          is_headquarters?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          notes?: string | null
          partner_id: string
          phone?: string | null
          postal_code: string
          preparation_time_minutes?: number
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          is_headquarters?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          notes?: string | null
          partner_id?: string
          phone?: string | null
          postal_code?: string
          preparation_time_minutes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dealer_locations_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deductible_insurance: {
        Row: {
          booking_id: string
          created_at: string
          daily_rate: number
          days_covered: number
          id: string
          new_deductible: number
          original_deductible: number
          renter_id: string | null
          status: string
          total_amount: number
        }
        Insert: {
          booking_id: string
          created_at?: string
          daily_rate?: number
          days_covered: number
          id?: string
          new_deductible?: number
          original_deductible?: number
          renter_id?: string | null
          status?: string
          total_amount: number
        }
        Update: {
          booking_id?: string
          created_at?: string
          daily_rate?: number
          days_covered?: number
          id?: string
          new_deductible?: number
          original_deductible?: number
          renter_id?: string | null
          status?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "deductible_insurance_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      deductible_profiles: {
        Row: {
          base_deductible: number
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          lessor_id: string
          max_vehicle_value: number | null
          min_completed_bookings: number | null
          min_renter_rating: number | null
          name: string
          premium_daily_rate: number | null
          premium_deductible: number | null
          updated_at: string | null
        }
        Insert: {
          base_deductible?: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          lessor_id: string
          max_vehicle_value?: number | null
          min_completed_bookings?: number | null
          min_renter_rating?: number | null
          name: string
          premium_daily_rate?: number | null
          premium_deductible?: number | null
          updated_at?: string | null
        }
        Update: {
          base_deductible?: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          lessor_id?: string
          max_vehicle_value?: number | null
          min_completed_bookings?: number | null
          min_renter_rating?: number | null
          name?: string
          premium_daily_rate?: number | null
          premium_deductible?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      deposit_transactions: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          description: string | null
          id: string
          lessor_id: string
          reference_id: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          description?: string | null
          id?: string
          lessor_id: string
          reference_id?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          description?: string | null
          id?: string
          lessor_id?: string
          reference_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "deposit_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
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
      driver_licenses: {
        Row: {
          ai_verification_result: Json | null
          back_image_url: string | null
          created_at: string
          expiry_date: string | null
          front_image_url: string | null
          id: string
          issue_date: string | null
          license_country: string
          license_number: string
          rejection_reason: string | null
          updated_at: string
          user_id: string
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          ai_verification_result?: Json | null
          back_image_url?: string | null
          created_at?: string
          expiry_date?: string | null
          front_image_url?: string | null
          id?: string
          issue_date?: string | null
          license_country?: string
          license_number: string
          rejection_reason?: string | null
          updated_at?: string
          user_id: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          ai_verification_result?: Json | null
          back_image_url?: string | null
          created_at?: string
          expiry_date?: string | null
          front_image_url?: string | null
          id?: string
          issue_date?: string | null
          license_country?: string
          license_number?: string
          rejection_reason?: string | null
          updated_at?: string
          user_id?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      facebook_posts: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          is_dagens_bil: boolean | null
          message: string
          post_id: string
          posted_at: string
          posted_by: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_dagens_bil?: boolean | null
          message: string
          post_id: string
          posted_at?: string
          posted_by: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_dagens_bil?: boolean | null
          message?: string
          post_id?: string
          posted_at?: string
          posted_by?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facebook_posts_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facebook_posts_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      fines: {
        Row: {
          admin_fee: number
          booking_id: string | null
          created_at: string
          description: string | null
          file_url: string | null
          fine_amount: number
          fine_date: string
          fine_type: string
          id: string
          lessor_id: string
          paid_at: string | null
          renter_email: string
          renter_name: string | null
          sent_to_renter_at: string | null
          status: string
          total_amount: number | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          admin_fee?: number
          booking_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          fine_amount: number
          fine_date: string
          fine_type?: string
          id?: string
          lessor_id: string
          paid_at?: string | null
          renter_email: string
          renter_name?: string | null
          sent_to_renter_at?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          admin_fee?: number
          booking_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          fine_amount?: number
          fine_date?: string
          fine_type?: string
          id?: string
          lessor_id?: string
          paid_at?: string | null
          renter_email?: string
          renter_name?: string | null
          sent_to_renter_at?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fines_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fines_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fines_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_dispatch_recommendations: {
        Row: {
          acted_at: string | null
          ai_confidence: number | null
          created_at: string | null
          expected_revenue_increase: number | null
          expires_at: string | null
          from_location_id: string | null
          id: string
          lessor_id: string
          priority: string
          reason: string
          recommendation_type: string
          status: string
          to_location_id: string | null
          vehicle_id: string | null
        }
        Insert: {
          acted_at?: string | null
          ai_confidence?: number | null
          created_at?: string | null
          expected_revenue_increase?: number | null
          expires_at?: string | null
          from_location_id?: string | null
          id?: string
          lessor_id: string
          priority?: string
          reason: string
          recommendation_type?: string
          status?: string
          to_location_id?: string | null
          vehicle_id?: string | null
        }
        Update: {
          acted_at?: string | null
          ai_confidence?: number | null
          created_at?: string | null
          expected_revenue_increase?: number | null
          expires_at?: string | null
          from_location_id?: string | null
          id?: string
          lessor_id?: string
          priority?: string
          reason?: string
          recommendation_type?: string
          status?: string
          to_location_id?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fleet_dispatch_recommendations_from_location_id_fkey"
            columns: ["from_location_id"]
            isOneToOne: false
            referencedRelation: "dealer_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_dispatch_recommendations_to_location_id_fkey"
            columns: ["to_location_id"]
            isOneToOne: false
            referencedRelation: "dealer_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_dispatch_recommendations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fleet_dispatch_recommendations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
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
      geofence_alerts: {
        Row: {
          alert_type: string
          created_at: string
          device_id: string
          geofence_id: string
          id: string
          is_read: boolean
          latitude: number
          longitude: number
        }
        Insert: {
          alert_type: string
          created_at?: string
          device_id: string
          geofence_id: string
          id?: string
          is_read?: boolean
          latitude: number
          longitude: number
        }
        Update: {
          alert_type?: string
          created_at?: string
          device_id?: string
          geofence_id?: string
          id?: string
          is_read?: boolean
          latitude?: number
          longitude?: number
        }
        Relationships: [
          {
            foreignKeyName: "geofence_alerts_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "gps_devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "geofence_alerts_geofence_id_fkey"
            columns: ["geofence_id"]
            isOneToOne: false
            referencedRelation: "geofences"
            referencedColumns: ["id"]
          },
        ]
      }
      geofences: {
        Row: {
          alert_on_enter: boolean
          alert_on_exit: boolean
          center_latitude: number
          center_longitude: number
          created_at: string
          geofence_type: string
          id: string
          is_active: boolean
          name: string
          polygon_coordinates: Json | null
          radius_meters: number
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          alert_on_enter?: boolean
          alert_on_exit?: boolean
          center_latitude: number
          center_longitude: number
          created_at?: string
          geofence_type?: string
          id?: string
          is_active?: boolean
          name: string
          polygon_coordinates?: Json | null
          radius_meters?: number
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          alert_on_enter?: boolean
          alert_on_exit?: boolean
          center_latitude?: number
          center_longitude?: number
          created_at?: string
          geofence_type?: string
          id?: string
          is_active?: boolean
          name?: string
          polygon_coordinates?: Json | null
          radius_meters?: number
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "geofences_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "geofences_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
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
          webhook_secret: string | null
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
          webhook_secret?: string | null
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
          webhook_secret?: string | null
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
      inspection_reminders: {
        Row: {
          completed_at: string | null
          created_at: string
          due_date: string
          id: string
          inspection_type: string
          is_completed: boolean
          last_inspection_date: string | null
          notes: string | null
          reminder_sent_at: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          due_date: string
          id?: string
          inspection_type?: string
          is_completed?: boolean
          last_inspection_date?: string | null
          notes?: string | null
          reminder_sent_at?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          due_date?: string
          id?: string
          inspection_type?: string
          is_completed?: boolean
          last_inspection_date?: string | null
          notes?: string | null
          reminder_sent_at?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_reminders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_reminders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          booking_id: string | null
          created_at: string
          currency: string
          due_date: string | null
          id: string
          invoice_number: string
          issued_at: string | null
          lessor_id: string
          line_items: Json
          paid_at: string | null
          pdf_url: string | null
          renter_address: string | null
          renter_cvr: string | null
          renter_email: string
          renter_name: string | null
          status: string
          subtotal: number
          total_amount: number
          updated_at: string
          vat_amount: number
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_number: string
          issued_at?: string | null
          lessor_id: string
          line_items?: Json
          paid_at?: string | null
          pdf_url?: string | null
          renter_address?: string | null
          renter_cvr?: string | null
          renter_email: string
          renter_name?: string | null
          status?: string
          subtotal: number
          total_amount: number
          updated_at?: string
          vat_amount?: number
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          issued_at?: string | null
          lessor_id?: string
          line_items?: Json
          paid_at?: string | null
          pdf_url?: string | null
          renter_address?: string | null
          renter_cvr?: string | null
          renter_email?: string
          renter_name?: string | null
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
          vat_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
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
      location_opening_hours: {
        Row: {
          closes_at: string | null
          day_of_week: number
          id: string
          is_closed: boolean
          location_id: string
          opens_at: string | null
        }
        Insert: {
          closes_at?: string | null
          day_of_week: number
          id?: string
          is_closed?: boolean
          location_id: string
          opens_at?: string | null
        }
        Update: {
          closes_at?: string | null
          day_of_week?: number
          id?: string
          is_closed?: boolean
          location_id?: string
          opens_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_opening_hours_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "dealer_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      location_special_days: {
        Row: {
          closes_at: string | null
          created_at: string
          date: string
          id: string
          is_closed: boolean
          location_id: string
          opens_at: string | null
          reason: string | null
        }
        Insert: {
          closes_at?: string | null
          created_at?: string
          date: string
          id?: string
          is_closed?: boolean
          location_id: string
          opens_at?: string | null
          reason?: string | null
        }
        Update: {
          closes_at?: string | null
          created_at?: string
          date?: string
          id?: string
          is_closed?: boolean
          location_id?: string
          opens_at?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_special_days_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "dealer_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      mc_check_photos: {
        Row: {
          ai_analysis: Json | null
          booking_id: string
          captured_at: string
          check_type: string
          created_at: string
          id: string
          photo_type: string
          photo_url: string
          vehicle_id: string
        }
        Insert: {
          ai_analysis?: Json | null
          booking_id: string
          captured_at?: string
          check_type: string
          created_at?: string
          id?: string
          photo_type: string
          photo_url: string
          vehicle_id: string
        }
        Update: {
          ai_analysis?: Json | null
          booking_id?: string
          captured_at?: string
          check_type?: string
          created_at?: string
          id?: string
          photo_type?: string
          photo_url?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mc_check_photos_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mc_check_photos_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mc_check_photos_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      mc_maintenance_log: {
        Row: {
          created_at: string
          id: string
          maintenance_type: string
          next_service_date: string | null
          next_service_km: number | null
          notes: string | null
          odometer_reading: number | null
          performed_at: string
          performed_by: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          maintenance_type: string
          next_service_date?: string | null
          next_service_km?: number | null
          notes?: string | null
          odometer_reading?: number | null
          performed_at?: string
          performed_by?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          maintenance_type?: string
          next_service_date?: string | null
          next_service_km?: number | null
          notes?: string | null
          odometer_reading?: number | null
          performed_at?: string
          performed_by?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mc_maintenance_log_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mc_maintenance_log_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_from_support: boolean
          is_read: boolean
          original_language: string | null
          sender_id: string
          target_language: string | null
          translated_content: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_from_support?: boolean
          is_read?: boolean
          original_language?: string | null
          sender_id: string
          target_language?: string | null
          translated_content?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_from_support?: boolean
          is_read?: boolean
          original_language?: string | null
          sender_id?: string
          target_language?: string | null
          translated_content?: string | null
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
          check_in_out_enabled: boolean | null
          city: string | null
          company_logo_url: string | null
          company_name: string | null
          created_at: string
          cvr_number: string | null
          email: string
          fine_admin_fee: number | null
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
          check_in_out_enabled?: boolean | null
          city?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          created_at?: string
          cvr_number?: string | null
          email: string
          fine_admin_fee?: number | null
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
          check_in_out_enabled?: boolean | null
          city?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          created_at?: string
          cvr_number?: string | null
          email?: string
          fine_admin_fee?: number | null
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
      referral_codes: {
        Row: {
          available_credit: number
          code: string
          created_at: string
          id: string
          total_credit_earned: number
          total_referrals: number
          updated_at: string
          user_id: string
        }
        Insert: {
          available_credit?: number
          code: string
          created_at?: string
          id?: string
          total_credit_earned?: number
          total_referrals?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          available_credit?: number
          code?: string
          created_at?: string
          id?: string
          total_credit_earned?: number
          total_referrals?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referral_redemptions: {
        Row: {
          booking_id: string | null
          completed_at: string | null
          created_at: string
          id: string
          referral_code_id: string
          referred_discount: number
          referred_user_id: string
          referrer_credit: number
          status: string
        }
        Insert: {
          booking_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code_id: string
          referred_discount?: number
          referred_user_id: string
          referrer_credit?: number
          status?: string
        }
        Update: {
          booking_id?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code_id?: string
          referred_discount?: number
          referred_user_id?: string
          referrer_credit?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_redemptions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_redemptions_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "referral_codes"
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
      revenue_loss_calculations: {
        Row: {
          ai_estimated_bookings: number | null
          booking_id: string | null
          calculation_date: string
          claim_approved_at: string | null
          claim_submitted_at: string | null
          created_at: string | null
          daily_rate_average: number
          damage_report_id: string | null
          days_out_of_service: number
          historical_utilization_rate: number | null
          id: string
          lessor_id: string
          notes: string | null
          repair_end_date: string | null
          repair_start_date: string | null
          status: string
          total_revenue_loss: number
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          ai_estimated_bookings?: number | null
          booking_id?: string | null
          calculation_date?: string
          claim_approved_at?: string | null
          claim_submitted_at?: string | null
          created_at?: string | null
          daily_rate_average: number
          damage_report_id?: string | null
          days_out_of_service: number
          historical_utilization_rate?: number | null
          id?: string
          lessor_id: string
          notes?: string | null
          repair_end_date?: string | null
          repair_start_date?: string | null
          status?: string
          total_revenue_loss: number
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          ai_estimated_bookings?: number | null
          booking_id?: string | null
          calculation_date?: string
          claim_approved_at?: string | null
          claim_submitted_at?: string | null
          created_at?: string | null
          daily_rate_average?: number
          damage_report_id?: string | null
          days_out_of_service?: number
          historical_utilization_rate?: number | null
          id?: string
          lessor_id?: string
          notes?: string | null
          repair_end_date?: string | null
          repair_start_date?: string | null
          status?: string
          total_revenue_loss?: number
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_loss_calculations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenue_loss_calculations_damage_report_id_fkey"
            columns: ["damage_report_id"]
            isOneToOne: false
            referencedRelation: "damage_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenue_loss_calculations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenue_loss_calculations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_emails: {
        Row: {
          body: string
          created_at: string
          created_by: string | null
          id: string
          lead_id: string | null
          sent_at: string | null
          status: string
          subject: string
        }
        Insert: {
          body: string
          created_at?: string
          created_by?: string | null
          id?: string
          lead_id?: string | null
          sent_at?: string | null
          status?: string
          subject: string
        }
        Update: {
          body?: string
          created_at?: string
          created_by?: string | null
          id?: string
          lead_id?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_emails_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "sales_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_leads: {
        Row: {
          address: string | null
          city: string | null
          company_name: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          created_by: string | null
          cvr_number: string | null
          facebook_url: string | null
          id: string
          industry: string | null
          last_contacted_at: string | null
          notes: string | null
          postal_code: string | null
          source: string
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          cvr_number?: string | null
          facebook_url?: string | null
          id?: string
          industry?: string | null
          last_contacted_at?: string | null
          notes?: string | null
          postal_code?: string | null
          source?: string
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          cvr_number?: string | null
          facebook_url?: string | null
          id?: string
          industry?: string | null
          last_contacted_at?: string | null
          notes?: string | null
          postal_code?: string | null
          source?: string
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      search_history: {
        Row: {
          end_date: string | null
          id: string
          ip_hash: string | null
          location_id: string | null
          results_count: number | null
          search_query: string | null
          searched_at: string | null
          start_date: string | null
          user_id: string | null
          vehicle_type: string | null
        }
        Insert: {
          end_date?: string | null
          id?: string
          ip_hash?: string | null
          location_id?: string | null
          results_count?: number | null
          search_query?: string | null
          searched_at?: string | null
          start_date?: string | null
          user_id?: string | null
          vehicle_type?: string | null
        }
        Update: {
          end_date?: string | null
          id?: string
          ip_hash?: string | null
          location_id?: string | null
          results_count?: number | null
          search_query?: string | null
          searched_at?: string | null
          start_date?: string | null
          user_id?: string | null
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_history_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "dealer_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      seasonal_pricing: {
        Row: {
          created_at: string
          end_date: string
          fixed_price: number | null
          id: string
          is_active: boolean
          name: string
          price_multiplier: number
          start_date: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          fixed_price?: number | null
          id?: string
          is_active?: boolean
          name: string
          price_multiplier?: number
          start_date: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          fixed_price?: number | null
          id?: string
          is_active?: boolean
          name?: string
          price_multiplier?: number
          start_date?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seasonal_pricing_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seasonal_pricing_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      service_bookings: {
        Row: {
          actual_cost: number | null
          completed_at: string | null
          created_at: string
          estimated_cost: number | null
          id: string
          lessor_id: string
          preferred_date: string
          preferred_time_slot: string | null
          service_reminder_id: string | null
          service_type: string
          status: string
          updated_at: string
          vehicle_id: string
          workshop_notes: string | null
        }
        Insert: {
          actual_cost?: number | null
          completed_at?: string | null
          created_at?: string
          estimated_cost?: number | null
          id?: string
          lessor_id: string
          preferred_date: string
          preferred_time_slot?: string | null
          service_reminder_id?: string | null
          service_type: string
          status?: string
          updated_at?: string
          vehicle_id: string
          workshop_notes?: string | null
        }
        Update: {
          actual_cost?: number | null
          completed_at?: string | null
          created_at?: string
          estimated_cost?: number | null
          id?: string
          lessor_id?: string
          preferred_date?: string
          preferred_time_slot?: string | null
          service_reminder_id?: string | null
          service_type?: string
          status?: string
          updated_at?: string
          vehicle_id?: string
          workshop_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_bookings_service_reminder_id_fkey"
            columns: ["service_reminder_id"]
            isOneToOne: false
            referencedRelation: "service_reminders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      service_reminders: {
        Row: {
          completed_at: string | null
          created_at: string
          current_km: number | null
          due_date: string | null
          due_km: number | null
          id: string
          is_completed: boolean
          notes: string | null
          service_type: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_km?: number | null
          due_date?: string | null
          due_km?: number | null
          id?: string
          is_completed?: boolean
          notes?: string | null
          service_type: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_km?: number | null
          due_date?: string | null
          due_km?: number | null
          id?: string
          is_completed?: boolean
          notes?: string | null
          service_type?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_reminders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_reminders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      service_tasks: {
        Row: {
          actual_duration_minutes: number | null
          assigned_to: string | null
          auto_block_bookings: boolean | null
          booking_block_end: string | null
          booking_block_start: string | null
          completed_at: string | null
          created_at: string | null
          date_trigger: string | null
          description: string | null
          estimated_duration_minutes: number | null
          id: string
          km_trigger: number | null
          lessor_id: string
          location_id: string | null
          notes: string | null
          priority: string
          scheduled_date: string | null
          scheduled_time: string | null
          status: string
          task_type: string
          title: string
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          actual_duration_minutes?: number | null
          assigned_to?: string | null
          auto_block_bookings?: boolean | null
          booking_block_end?: string | null
          booking_block_start?: string | null
          completed_at?: string | null
          created_at?: string | null
          date_trigger?: string | null
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          km_trigger?: number | null
          lessor_id: string
          location_id?: string | null
          notes?: string | null
          priority?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
          task_type: string
          title: string
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          actual_duration_minutes?: number | null
          assigned_to?: string | null
          auto_block_bookings?: boolean | null
          booking_block_end?: string | null
          booking_block_start?: string | null
          completed_at?: string | null
          created_at?: string | null
          date_trigger?: string | null
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: string
          km_trigger?: number | null
          lessor_id?: string
          location_id?: string | null
          notes?: string | null
          priority?: string
          scheduled_date?: string | null
          scheduled_time?: string | null
          status?: string
          task_type?: string
          title?: string
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_tasks_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "dealer_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_tasks_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_tasks_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_rentals: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          lessor_id: string
          monthly_price: number
          next_payment_date: string | null
          renter_email: string
          renter_id: string | null
          renter_name: string | null
          renter_phone: string | null
          start_date: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          lessor_id: string
          monthly_price: number
          next_payment_date?: string | null
          renter_email: string
          renter_id?: string | null
          renter_name?: string | null
          renter_phone?: string | null
          start_date: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          lessor_id?: string
          monthly_price?: number
          next_payment_date?: string | null
          renter_email?: string
          renter_id?: string | null
          renter_name?: string | null
          renter_phone?: string | null
          start_date?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_rentals_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_rentals_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
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
      tire_sets: {
        Row: {
          brand: string | null
          created_at: string
          dot_code: string | null
          id: string
          is_mounted: boolean
          model: string | null
          notes: string | null
          purchase_date: string | null
          size: string
          storage_location: string | null
          tire_type: string
          tread_depth_mm: number | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          brand?: string | null
          created_at?: string
          dot_code?: string | null
          id?: string
          is_mounted?: boolean
          model?: string | null
          notes?: string | null
          purchase_date?: string | null
          size: string
          storage_location?: string | null
          tire_type: string
          tread_depth_mm?: number | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          brand?: string | null
          created_at?: string
          dot_code?: string | null
          id?: string
          is_mounted?: boolean
          model?: string | null
          notes?: string | null
          purchase_date?: string | null
          size?: string
          storage_location?: string | null
          tire_type?: string
          tread_depth_mm?: number | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tire_sets_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tire_sets_vehicle_id_fkey"
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
      vehicle_favorites: {
        Row: {
          created_at: string
          id: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_favorites_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_favorites_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_images: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_images_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_images_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_scan_areas: {
        Row: {
          area_code: string
          area_label: string
          created_at: string
          id: string
          image_url: string | null
          scan_session_id: string
          scanned_at: string
        }
        Insert: {
          area_code: string
          area_label: string
          created_at?: string
          id?: string
          image_url?: string | null
          scan_session_id: string
          scanned_at?: string
        }
        Update: {
          area_code?: string
          area_label?: string
          created_at?: string
          id?: string
          image_url?: string | null
          scan_session_id?: string
          scanned_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_scan_areas_scan_session_id_fkey"
            columns: ["scan_session_id"]
            isOneToOne: false
            referencedRelation: "vehicle_scan_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_scan_damages: {
        Row: {
          confidence: number | null
          created_at: string
          damage_type: string
          description: string | null
          id: string
          image_url: string | null
          position: string
          scan_area_id: string
          scan_session_id: string
          severity: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          damage_type: string
          description?: string | null
          id?: string
          image_url?: string | null
          position: string
          scan_area_id: string
          scan_session_id: string
          severity: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          damage_type?: string
          description?: string | null
          id?: string
          image_url?: string | null
          position?: string
          scan_area_id?: string
          scan_session_id?: string
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_scan_damages_scan_area_id_fkey"
            columns: ["scan_area_id"]
            isOneToOne: false
            referencedRelation: "vehicle_scan_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_scan_damages_scan_session_id_fkey"
            columns: ["scan_session_id"]
            isOneToOne: false
            referencedRelation: "vehicle_scan_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_scan_sessions: {
        Row: {
          booking_id: string
          check_in_out_record_id: string | null
          completed_at: string | null
          created_at: string
          has_severe_damage: boolean
          id: string
          lessor_id: string
          renter_id: string | null
          scan_type: string
          total_areas_scanned: number
          total_damages_found: number
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          booking_id: string
          check_in_out_record_id?: string | null
          completed_at?: string | null
          created_at?: string
          has_severe_damage?: boolean
          id?: string
          lessor_id: string
          renter_id?: string | null
          scan_type: string
          total_areas_scanned?: number
          total_damages_found?: number
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          booking_id?: string
          check_in_out_record_id?: string | null
          completed_at?: string | null
          created_at?: string
          has_severe_damage?: boolean
          id?: string
          lessor_id?: string
          renter_id?: string | null
          scan_type?: string
          total_areas_scanned?: number
          total_damages_found?: number
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_scan_sessions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_scan_sessions_check_in_out_record_id_fkey"
            columns: ["check_in_out_record_id"]
            isOneToOne: false
            referencedRelation: "check_in_out_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_scan_sessions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_scan_sessions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_service_logs: {
        Row: {
          cost: number | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          notes: string | null
          odometer_reading: number | null
          performed_by: string | null
          service_date: string
          service_type: string
          vehicle_id: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          notes?: string | null
          odometer_reading?: number | null
          performed_by?: string | null
          service_date?: string
          service_type: string
          vehicle_id: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          notes?: string | null
          odometer_reading?: number | null
          performed_by?: string | null
          service_date?: string
          service_type?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_service_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_service_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_swaps: {
        Row: {
          accepted_at: string | null
          booking_id: string
          contract_addendum_url: string | null
          created_at: string
          created_by: string
          id: string
          new_vehicle_id: string
          notes: string | null
          original_odometer: number | null
          original_vehicle_id: string
          swap_date: string
          swap_reason: string
        }
        Insert: {
          accepted_at?: string | null
          booking_id: string
          contract_addendum_url?: string | null
          created_at?: string
          created_by: string
          id?: string
          new_vehicle_id: string
          notes?: string | null
          original_odometer?: number | null
          original_vehicle_id: string
          swap_date?: string
          swap_reason: string
        }
        Update: {
          accepted_at?: string | null
          booking_id?: string
          contract_addendum_url?: string | null
          created_at?: string
          created_by?: string
          id?: string
          new_vehicle_id?: string
          notes?: string | null
          original_odometer?: number | null
          original_vehicle_id?: string
          swap_date?: string
          swap_reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_swaps_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_swaps_new_vehicle_id_fkey"
            columns: ["new_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_swaps_new_vehicle_id_fkey"
            columns: ["new_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_swaps_original_vehicle_id_fkey"
            columns: ["original_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_swaps_original_vehicle_id_fkey"
            columns: ["original_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_public"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          adult_sleeping_capacity: number | null
          camping_furniture_included: boolean | null
          chain_last_checked_at: string | null
          chain_last_checked_km: number | null
          child_sleeping_capacity: number | null
          color: string | null
          created_at: string
          current_location_id: string | null
          current_odometer: number | null
          daily_price: number | null
          default_dropoff_time: string | null
          default_pickup_time: string | null
          deposit_amount: number | null
          deposit_required: boolean
          description: string | null
          engine_cc: number | null
          engine_kw: number | null
          exterior_cleaning_fee: number | null
          extra_km_price: number | null
          features: string[] | null
          festival_use_allowed: boolean | null
          fuel_type: string | null
          gas_bottle_included: boolean | null
          has_abs: boolean | null
          has_ac: boolean | null
          has_adapter: boolean | null
          has_awning: boolean | null
          has_awning_tent: boolean | null
          has_bathroom: boolean | null
          has_bike_rack: boolean | null
          has_chain_lock: boolean | null
          has_disc_lock: boolean | null
          has_floor_heating: boolean | null
          has_freezer: boolean | null
          has_fridge: boolean | null
          has_gas_burner: boolean | null
          has_heated_grips: boolean | null
          has_hot_water: boolean | null
          has_jockey_wheel: boolean | null
          has_kitchen: boolean | null
          has_lock_included: boolean | null
          has_mover: boolean | null
          has_net: boolean | null
          has_phone_mount: boolean | null
          has_ramps: boolean | null
          has_shower: boolean | null
          has_side_bags: boolean | null
          has_steering_lock: boolean | null
          has_tank_bag: boolean | null
          has_tarpaulin: boolean | null
          has_toilet: boolean | null
          has_top_box: boolean | null
          has_tv: boolean | null
          has_usb_outlet: boolean | null
          has_winch: boolean | null
          has_windscreen: boolean | null
          helmet_included: boolean | null
          helmet_size: string | null
          id: string
          image_url: string | null
          included_km: number | null
          interior_cleaning_fee: number | null
          internal_height_cm: number | null
          internal_length_cm: number | null
          internal_width_cm: number | null
          is_available: boolean | null
          last_service_date: string | null
          last_service_odometer: number | null
          late_return_charge_enabled: boolean | null
          latitude: number | null
          layout_type: string | null
          location_address: string | null
          location_city: string | null
          location_postal_code: string | null
          longitude: number | null
          make: string
          mc_category: string | null
          mc_daily_km_limit: number | null
          model: string
          monthly_price: number | null
          next_inspection_date: string | null
          owner_id: string
          payment_schedule:
            | Database["public"]["Enums"]["payment_schedule_type"]
            | null
          pets_allowed: boolean | null
          plug_type: string | null
          prepaid_rent_enabled: boolean
          prepaid_rent_months: number | null
          rain_guarantee_enabled: boolean | null
          registration: string
          requires_b_license: boolean | null
          seat_height_mm: number | null
          service_included: boolean | null
          service_interval_km: number | null
          service_interval_months: number | null
          service_status: string | null
          sleeping_capacity: number | null
          smoking_allowed: boolean | null
          subscription_available: boolean | null
          subscription_monthly_price: number | null
          tempo_approved: boolean | null
          tire_change_reminder_sent: boolean | null
          tire_hotel_location: string | null
          tire_size: string | null
          tire_tread_front_mm: number | null
          tire_tread_rear_mm: number | null
          tire_type: string | null
          total_weight: number | null
          trailer_type: string | null
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
          vehicle_type: string
          vehicle_value: number | null
          vin: string | null
          weekly_price: number | null
          winter_deactivated: boolean | null
          year: number | null
        }
        Insert: {
          adult_sleeping_capacity?: number | null
          camping_furniture_included?: boolean | null
          chain_last_checked_at?: string | null
          chain_last_checked_km?: number | null
          child_sleeping_capacity?: number | null
          color?: string | null
          created_at?: string
          current_location_id?: string | null
          current_odometer?: number | null
          daily_price?: number | null
          default_dropoff_time?: string | null
          default_pickup_time?: string | null
          deposit_amount?: number | null
          deposit_required?: boolean
          description?: string | null
          engine_cc?: number | null
          engine_kw?: number | null
          exterior_cleaning_fee?: number | null
          extra_km_price?: number | null
          features?: string[] | null
          festival_use_allowed?: boolean | null
          fuel_type?: string | null
          gas_bottle_included?: boolean | null
          has_abs?: boolean | null
          has_ac?: boolean | null
          has_adapter?: boolean | null
          has_awning?: boolean | null
          has_awning_tent?: boolean | null
          has_bathroom?: boolean | null
          has_bike_rack?: boolean | null
          has_chain_lock?: boolean | null
          has_disc_lock?: boolean | null
          has_floor_heating?: boolean | null
          has_freezer?: boolean | null
          has_fridge?: boolean | null
          has_gas_burner?: boolean | null
          has_heated_grips?: boolean | null
          has_hot_water?: boolean | null
          has_jockey_wheel?: boolean | null
          has_kitchen?: boolean | null
          has_lock_included?: boolean | null
          has_mover?: boolean | null
          has_net?: boolean | null
          has_phone_mount?: boolean | null
          has_ramps?: boolean | null
          has_shower?: boolean | null
          has_side_bags?: boolean | null
          has_steering_lock?: boolean | null
          has_tank_bag?: boolean | null
          has_tarpaulin?: boolean | null
          has_toilet?: boolean | null
          has_top_box?: boolean | null
          has_tv?: boolean | null
          has_usb_outlet?: boolean | null
          has_winch?: boolean | null
          has_windscreen?: boolean | null
          helmet_included?: boolean | null
          helmet_size?: string | null
          id?: string
          image_url?: string | null
          included_km?: number | null
          interior_cleaning_fee?: number | null
          internal_height_cm?: number | null
          internal_length_cm?: number | null
          internal_width_cm?: number | null
          is_available?: boolean | null
          last_service_date?: string | null
          last_service_odometer?: number | null
          late_return_charge_enabled?: boolean | null
          latitude?: number | null
          layout_type?: string | null
          location_address?: string | null
          location_city?: string | null
          location_postal_code?: string | null
          longitude?: number | null
          make: string
          mc_category?: string | null
          mc_daily_km_limit?: number | null
          model: string
          monthly_price?: number | null
          next_inspection_date?: string | null
          owner_id: string
          payment_schedule?:
            | Database["public"]["Enums"]["payment_schedule_type"]
            | null
          pets_allowed?: boolean | null
          plug_type?: string | null
          prepaid_rent_enabled?: boolean
          prepaid_rent_months?: number | null
          rain_guarantee_enabled?: boolean | null
          registration: string
          requires_b_license?: boolean | null
          seat_height_mm?: number | null
          service_included?: boolean | null
          service_interval_km?: number | null
          service_interval_months?: number | null
          service_status?: string | null
          sleeping_capacity?: number | null
          smoking_allowed?: boolean | null
          subscription_available?: boolean | null
          subscription_monthly_price?: number | null
          tempo_approved?: boolean | null
          tire_change_reminder_sent?: boolean | null
          tire_hotel_location?: string | null
          tire_size?: string | null
          tire_tread_front_mm?: number | null
          tire_tread_rear_mm?: number | null
          tire_type?: string | null
          total_weight?: number | null
          trailer_type?: string | null
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
          vehicle_type?: string
          vehicle_value?: number | null
          vin?: string | null
          weekly_price?: number | null
          winter_deactivated?: boolean | null
          year?: number | null
        }
        Update: {
          adult_sleeping_capacity?: number | null
          camping_furniture_included?: boolean | null
          chain_last_checked_at?: string | null
          chain_last_checked_km?: number | null
          child_sleeping_capacity?: number | null
          color?: string | null
          created_at?: string
          current_location_id?: string | null
          current_odometer?: number | null
          daily_price?: number | null
          default_dropoff_time?: string | null
          default_pickup_time?: string | null
          deposit_amount?: number | null
          deposit_required?: boolean
          description?: string | null
          engine_cc?: number | null
          engine_kw?: number | null
          exterior_cleaning_fee?: number | null
          extra_km_price?: number | null
          features?: string[] | null
          festival_use_allowed?: boolean | null
          fuel_type?: string | null
          gas_bottle_included?: boolean | null
          has_abs?: boolean | null
          has_ac?: boolean | null
          has_adapter?: boolean | null
          has_awning?: boolean | null
          has_awning_tent?: boolean | null
          has_bathroom?: boolean | null
          has_bike_rack?: boolean | null
          has_chain_lock?: boolean | null
          has_disc_lock?: boolean | null
          has_floor_heating?: boolean | null
          has_freezer?: boolean | null
          has_fridge?: boolean | null
          has_gas_burner?: boolean | null
          has_heated_grips?: boolean | null
          has_hot_water?: boolean | null
          has_jockey_wheel?: boolean | null
          has_kitchen?: boolean | null
          has_lock_included?: boolean | null
          has_mover?: boolean | null
          has_net?: boolean | null
          has_phone_mount?: boolean | null
          has_ramps?: boolean | null
          has_shower?: boolean | null
          has_side_bags?: boolean | null
          has_steering_lock?: boolean | null
          has_tank_bag?: boolean | null
          has_tarpaulin?: boolean | null
          has_toilet?: boolean | null
          has_top_box?: boolean | null
          has_tv?: boolean | null
          has_usb_outlet?: boolean | null
          has_winch?: boolean | null
          has_windscreen?: boolean | null
          helmet_included?: boolean | null
          helmet_size?: string | null
          id?: string
          image_url?: string | null
          included_km?: number | null
          interior_cleaning_fee?: number | null
          internal_height_cm?: number | null
          internal_length_cm?: number | null
          internal_width_cm?: number | null
          is_available?: boolean | null
          last_service_date?: string | null
          last_service_odometer?: number | null
          late_return_charge_enabled?: boolean | null
          latitude?: number | null
          layout_type?: string | null
          location_address?: string | null
          location_city?: string | null
          location_postal_code?: string | null
          longitude?: number | null
          make?: string
          mc_category?: string | null
          mc_daily_km_limit?: number | null
          model?: string
          monthly_price?: number | null
          next_inspection_date?: string | null
          owner_id?: string
          payment_schedule?:
            | Database["public"]["Enums"]["payment_schedule_type"]
            | null
          pets_allowed?: boolean | null
          plug_type?: string | null
          prepaid_rent_enabled?: boolean
          prepaid_rent_months?: number | null
          rain_guarantee_enabled?: boolean | null
          registration?: string
          requires_b_license?: boolean | null
          seat_height_mm?: number | null
          service_included?: boolean | null
          service_interval_km?: number | null
          service_interval_months?: number | null
          service_status?: string | null
          sleeping_capacity?: number | null
          smoking_allowed?: boolean | null
          subscription_available?: boolean | null
          subscription_monthly_price?: number | null
          tempo_approved?: boolean | null
          tire_change_reminder_sent?: boolean | null
          tire_hotel_location?: string | null
          tire_size?: string | null
          tire_tread_front_mm?: number | null
          tire_tread_rear_mm?: number | null
          tire_type?: string | null
          total_weight?: number | null
          trailer_type?: string | null
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
          vehicle_type?: string
          vehicle_value?: number | null
          vin?: string | null
          weekly_price?: number | null
          winter_deactivated?: boolean | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_current_location_id_fkey"
            columns: ["current_location_id"]
            isOneToOne: false
            referencedRelation: "dealer_locations"
            referencedColumns: ["id"]
          },
        ]
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
          session_token_hash: string | null
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
          session_token_hash?: string | null
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
          session_token_hash?: string | null
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
      workshop_services: {
        Row: {
          created_at: string
          description: string | null
          estimated_minutes: number
          fleet_owner_id: string
          id: string
          is_active: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_minutes?: number
          fleet_owner_id: string
          id?: string
          is_active?: boolean
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_minutes?: number
          fleet_owner_id?: string
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      vehicles_public: {
        Row: {
          adult_sleeping_capacity: number | null
          camping_furniture_included: boolean | null
          child_sleeping_capacity: number | null
          color: string | null
          daily_price: number | null
          deposit_amount: number | null
          deposit_required: boolean | null
          description: string | null
          extra_km_price: number | null
          features: string[] | null
          festival_use_allowed: boolean | null
          fuel_type: string | null
          gas_bottle_included: boolean | null
          has_ac: boolean | null
          has_adapter: boolean | null
          has_awning: boolean | null
          has_awning_tent: boolean | null
          has_bathroom: boolean | null
          has_bike_rack: boolean | null
          has_floor_heating: boolean | null
          has_freezer: boolean | null
          has_fridge: boolean | null
          has_gas_burner: boolean | null
          has_hot_water: boolean | null
          has_jockey_wheel: boolean | null
          has_kitchen: boolean | null
          has_lock_included: boolean | null
          has_mover: boolean | null
          has_net: boolean | null
          has_ramps: boolean | null
          has_shower: boolean | null
          has_tarpaulin: boolean | null
          has_toilet: boolean | null
          has_tv: boolean | null
          has_winch: boolean | null
          id: string | null
          image_url: string | null
          included_km: number | null
          internal_height_cm: number | null
          internal_length_cm: number | null
          internal_width_cm: number | null
          is_available: boolean | null
          latitude: number | null
          layout_type: string | null
          location_address: string | null
          location_city: string | null
          location_postal_code: string | null
          longitude: number | null
          make: string | null
          model: string | null
          monthly_price: number | null
          owner_id: string | null
          payment_schedule:
            | Database["public"]["Enums"]["payment_schedule_type"]
            | null
          pets_allowed: boolean | null
          plug_type: string | null
          prepaid_rent_enabled: boolean | null
          prepaid_rent_months: number | null
          registration: string | null
          requires_b_license: boolean | null
          service_included: boolean | null
          sleeping_capacity: number | null
          smoking_allowed: boolean | null
          tempo_approved: boolean | null
          total_weight: number | null
          trailer_type: string | null
          unlimited_km: boolean | null
          use_custom_location: boolean | null
          variant: string | null
          vehicle_type: string | null
          weekly_price: number | null
          year: number | null
        }
        Insert: {
          adult_sleeping_capacity?: number | null
          camping_furniture_included?: boolean | null
          child_sleeping_capacity?: number | null
          color?: string | null
          daily_price?: number | null
          deposit_amount?: number | null
          deposit_required?: boolean | null
          description?: string | null
          extra_km_price?: number | null
          features?: string[] | null
          festival_use_allowed?: boolean | null
          fuel_type?: string | null
          gas_bottle_included?: boolean | null
          has_ac?: boolean | null
          has_adapter?: boolean | null
          has_awning?: boolean | null
          has_awning_tent?: boolean | null
          has_bathroom?: boolean | null
          has_bike_rack?: boolean | null
          has_floor_heating?: boolean | null
          has_freezer?: boolean | null
          has_fridge?: boolean | null
          has_gas_burner?: boolean | null
          has_hot_water?: boolean | null
          has_jockey_wheel?: boolean | null
          has_kitchen?: boolean | null
          has_lock_included?: boolean | null
          has_mover?: boolean | null
          has_net?: boolean | null
          has_ramps?: boolean | null
          has_shower?: boolean | null
          has_tarpaulin?: boolean | null
          has_toilet?: boolean | null
          has_tv?: boolean | null
          has_winch?: boolean | null
          id?: string | null
          image_url?: string | null
          included_km?: number | null
          internal_height_cm?: number | null
          internal_length_cm?: number | null
          internal_width_cm?: number | null
          is_available?: boolean | null
          latitude?: never
          layout_type?: string | null
          location_address?: string | null
          location_city?: string | null
          location_postal_code?: string | null
          longitude?: never
          make?: string | null
          model?: string | null
          monthly_price?: number | null
          owner_id?: string | null
          payment_schedule?:
            | Database["public"]["Enums"]["payment_schedule_type"]
            | null
          pets_allowed?: boolean | null
          plug_type?: string | null
          prepaid_rent_enabled?: boolean | null
          prepaid_rent_months?: number | null
          registration?: string | null
          requires_b_license?: boolean | null
          service_included?: boolean | null
          sleeping_capacity?: number | null
          smoking_allowed?: boolean | null
          tempo_approved?: boolean | null
          total_weight?: number | null
          trailer_type?: string | null
          unlimited_km?: boolean | null
          use_custom_location?: boolean | null
          variant?: string | null
          vehicle_type?: string | null
          weekly_price?: number | null
          year?: number | null
        }
        Update: {
          adult_sleeping_capacity?: number | null
          camping_furniture_included?: boolean | null
          child_sleeping_capacity?: number | null
          color?: string | null
          daily_price?: number | null
          deposit_amount?: number | null
          deposit_required?: boolean | null
          description?: string | null
          extra_km_price?: number | null
          features?: string[] | null
          festival_use_allowed?: boolean | null
          fuel_type?: string | null
          gas_bottle_included?: boolean | null
          has_ac?: boolean | null
          has_adapter?: boolean | null
          has_awning?: boolean | null
          has_awning_tent?: boolean | null
          has_bathroom?: boolean | null
          has_bike_rack?: boolean | null
          has_floor_heating?: boolean | null
          has_freezer?: boolean | null
          has_fridge?: boolean | null
          has_gas_burner?: boolean | null
          has_hot_water?: boolean | null
          has_jockey_wheel?: boolean | null
          has_kitchen?: boolean | null
          has_lock_included?: boolean | null
          has_mover?: boolean | null
          has_net?: boolean | null
          has_ramps?: boolean | null
          has_shower?: boolean | null
          has_tarpaulin?: boolean | null
          has_toilet?: boolean | null
          has_tv?: boolean | null
          has_winch?: boolean | null
          id?: string | null
          image_url?: string | null
          included_km?: number | null
          internal_height_cm?: number | null
          internal_length_cm?: number | null
          internal_width_cm?: number | null
          is_available?: boolean | null
          latitude?: never
          layout_type?: string | null
          location_address?: string | null
          location_city?: string | null
          location_postal_code?: string | null
          longitude?: never
          make?: string | null
          model?: string | null
          monthly_price?: number | null
          owner_id?: string | null
          payment_schedule?:
            | Database["public"]["Enums"]["payment_schedule_type"]
            | null
          pets_allowed?: boolean | null
          plug_type?: string | null
          prepaid_rent_enabled?: boolean | null
          prepaid_rent_months?: number | null
          registration?: string | null
          requires_b_license?: boolean | null
          service_included?: boolean | null
          sleeping_capacity?: number | null
          smoking_allowed?: boolean | null
          tempo_approved?: boolean | null
          total_weight?: number | null
          trailer_type?: string | null
          unlimited_km?: boolean | null
          use_custom_location?: boolean | null
          variant?: string | null
          vehicle_type?: string | null
          weekly_price?: number | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _target_user_id: string
        }
        Returns: boolean
      }
      can_manage_vehicle_image: {
        Args: { object_name: string }
        Returns: boolean
      }
      can_manage_vehicle_image_path: {
        Args: { object_name: string }
        Returns: boolean
      }
      can_view_vehicle_sensitive_data: {
        Args: { vehicle_id: string }
        Returns: boolean
      }
      check_vehicle_availability: {
        Args: {
          p_end_date: string
          p_exclude_booking_id?: string
          p_start_date: string
          p_vehicle_id: string
        }
        Returns: boolean
      }
      generate_contract_number: { Args: never; Returns: string }
      generate_corporate_invoice_number: { Args: never; Returns: string }
      generate_invoice_number: { Args: never; Returns: string }
      generate_referral_code: { Args: never; Returns: string }
      get_admin_users: {
        Args: never
        Returns: {
          created_at: string
          email: string
          full_name: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }[]
      }
      get_renter_rating_stats: {
        Args: { renter_email_input: string }
        Returns: {
          average_rating: number
          total_ratings: number
        }[]
      }
      has_any_admin_role: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_location_open: {
        Args: { _datetime: string; _location_id: string }
        Returns: boolean
      }
      is_vehicle_owner: {
        Args: { _user_id: string; _vehicle_id: string }
        Returns: boolean
      }
      remove_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _target_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "super_admin" | "support"
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
      app_role: ["admin", "super_admin", "support"],
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
