import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

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
  description: string | null;
  is_available: boolean;
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
  description?: string;
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
      setVehicles(data || []);
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
          toast.error('Denne bil er allerede registreret');
        } else {
          toast.error('Kunne ikke tilføje køretøj');
        }
        throw insertError;
      }

      setVehicles(prev => [data, ...prev]);
      toast.success('Køretøj tilføjet!');
      return data;
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
