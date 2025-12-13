import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type PaymentScheduleType = 'upfront' | 'monthly';
export type VehicleType = 'bil' | 'trailer' | 'campingvogn';

export interface Vehicle {
  id: string;
  owner_id: string;
  registration: string;
  make: string;
  model: string;
  variant: string | null;
  year: number | null;
  fuel_type: string | null;
  color: string | null;
  vin: string | null;
  daily_price: number | null;
  weekly_price: number | null;
  monthly_price: number | null;
  included_km: number | null;
  extra_km_price: number | null;
  unlimited_km: boolean;
  description: string | null;
  image_url: string | null;
  features: string[];
  is_available: boolean;
  deposit_required: boolean;
  deposit_amount: number | null;
  prepaid_rent_enabled: boolean;
  prepaid_rent_months: number | null;
  payment_schedule: PaymentScheduleType | null;
  use_custom_location: boolean;
  location_address: string | null;
  location_postal_code: string | null;
  location_city: string | null;
  latitude: number | null;
  longitude: number | null;
  vehicle_value: number | null;
  vehicle_type: VehicleType;
  total_weight: number | null;
  requires_b_license: boolean;
  sleeping_capacity: number | null;
  has_kitchen: boolean;
  has_bathroom: boolean;
  has_awning: boolean;
  // Trailer specific
  trailer_type: string | null;
  internal_length_cm: number | null;
  internal_width_cm: number | null;
  internal_height_cm: number | null;
  plug_type: string | null;
  tempo_approved: boolean;
  has_ramps: boolean;
  has_winch: boolean;
  has_tarpaulin: boolean;
  has_net: boolean;
  has_jockey_wheel: boolean;
  has_lock_included: boolean;
  has_adapter: boolean;
  // Caravan specific
  adult_sleeping_capacity: number | null;
  child_sleeping_capacity: number | null;
  layout_type: string | null;
  has_fridge: boolean;
  has_freezer: boolean;
  has_gas_burner: boolean;
  has_toilet: boolean;
  has_shower: boolean;
  has_hot_water: boolean;
  has_awning_tent: boolean;
  has_mover: boolean;
  has_bike_rack: boolean;
  has_ac: boolean;
  has_floor_heating: boolean;
  has_tv: boolean;
  service_included: boolean;
  camping_furniture_included: boolean;
  gas_bottle_included: boolean;
  pets_allowed: boolean;
  smoking_allowed: boolean;
  festival_use_allowed: boolean;
  created_at: string;
  updated_at: string;
}

export interface VehicleInsert {
  registration: string;
  make: string;
  model: string;
  variant?: string;
  year?: number;
  fuel_type?: string;
  color?: string;
  vin?: string;
  daily_price?: number;
  weekly_price?: number;
  monthly_price?: number;
  included_km?: number;
  extra_km_price?: number;
  unlimited_km?: boolean;
  description?: string;
  image_url?: string;
  features?: string[];
  deposit_required?: boolean;
  deposit_amount?: number;
  prepaid_rent_enabled?: boolean;
  prepaid_rent_months?: number;
  payment_schedule?: PaymentScheduleType;
  use_custom_location?: boolean;
  location_address?: string;
  location_postal_code?: string;
  location_city?: string;
  latitude?: number;
  longitude?: number;
  vehicle_value?: number;
  vehicle_type?: VehicleType;
  total_weight?: number;
  requires_b_license?: boolean;
  sleeping_capacity?: number;
  has_kitchen?: boolean;
  has_bathroom?: boolean;
  has_awning?: boolean;
  // Trailer specific
  trailer_type?: string;
  internal_length_cm?: number;
  internal_width_cm?: number;
  internal_height_cm?: number;
  plug_type?: string;
  tempo_approved?: boolean;
  has_ramps?: boolean;
  has_winch?: boolean;
  has_tarpaulin?: boolean;
  has_net?: boolean;
  has_jockey_wheel?: boolean;
  has_lock_included?: boolean;
  has_adapter?: boolean;
  // Caravan specific
  adult_sleeping_capacity?: number;
  child_sleeping_capacity?: number;
  layout_type?: string;
  has_fridge?: boolean;
  has_freezer?: boolean;
  has_gas_burner?: boolean;
  has_toilet?: boolean;
  has_shower?: boolean;
  has_hot_water?: boolean;
  has_awning_tent?: boolean;
  has_mover?: boolean;
  has_bike_rack?: boolean;
  has_ac?: boolean;
  has_floor_heating?: boolean;
  has_tv?: boolean;
  service_included?: boolean;
  camping_furniture_included?: boolean;
  gas_bottle_included?: boolean;
  pets_allowed?: boolean;
  smoking_allowed?: boolean;
  festival_use_allowed?: boolean;
}

export const useVehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = async () => {
    if (!user) {
      setVehicles([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      // Cast vehicle_type to VehicleType
      const typedData = (data || []).map(v => ({
        ...v,
        vehicle_type: (v.vehicle_type || 'bil') as VehicleType,
      }));
      setVehicles(typedData);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Kunne ikke hente køretøjer');
    } finally {
      setIsLoading(false);
    }
  };

  const addVehicle = async (vehicleData: VehicleInsert): Promise<Vehicle | null> => {
    if (!user) {
      toast.error('Du skal være logget ind');
      return null;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('vehicles')
        .insert({
          ...vehicleData,
          owner_id: user.id,
        })
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '23505') {
          toast.error('Dette køretøj er allerede registreret');
        } else {
          toast.error('Kunne ikke tilføje køretøj');
        }
        throw insertError;
      }

      const typedData = { ...data, vehicle_type: (data.vehicle_type || 'bil') as VehicleType };
      setVehicles(prev => [typedData, ...prev]);
      toast.success('Køretøj tilføjet!');
      return typedData;
    } catch (err) {
      console.error('Error adding vehicle:', err);
      return null;
    }
  };

  const updateVehicle = async (id: string, updates: Partial<VehicleInsert>): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
      toast.success('Køretøj opdateret');
      return true;
    } catch (err) {
      console.error('Error updating vehicle:', err);
      toast.error('Kunne ikke opdatere køretøj');
      return false;
    }
  };

  const deleteVehicle = async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setVehicles(prev => prev.filter(v => v.id !== id));
      toast.success('Køretøj slettet');
      return true;
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      toast.error('Kunne ikke slette køretøj');
      return false;
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [user]);

  return {
    vehicles,
    isLoading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    refetch: fetchVehicles,
  };
};
