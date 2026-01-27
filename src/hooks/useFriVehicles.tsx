import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year?: number;
  license_plate: string;
  vin?: string;
  daily_rate?: number;
  mileage_limit?: number;
  availability_status: 'available' | 'rented' | 'maintenance' | 'retired';
  created_at: string;
  updated_at: string;
}

export interface CreateVehicleInput {
  make: string;
  model: string;
  year?: number;
  license_plate: string;
  vin?: string;
  daily_rate?: number;
  mileage_limit?: number;
}

/**
 * Hook to manage lessor's fleet vehicles
 * Stores in Supabase for now, will move to Azure when connected
 */
export function useFriVehicles(lessorId: string | null) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch vehicles
  const fetch = useCallback(async () => {
    if (!lessorId) return;

    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('vehicles')
        .select('*')
        .eq('lessor_id', lessorId)
        .order('created_at', { ascending: false });

      if (err) throw err;
      setVehicles((data as Vehicle[]) || []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [lessorId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Add vehicle
  const addVehicle = useCallback(
    async (input: CreateVehicleInput) => {
      if (!lessorId) throw new Error('No lessor ID');

      try {
        const { data, error: err } = await supabase
          .from('vehicles')
          .insert({
            lessor_id: lessorId,
            ...input,
            availability_status: 'available',
          })
          .select()
          .single();

        if (err) throw err;
        setVehicles((prev) => [data as Vehicle, ...prev]);
        return data;
      } catch (err) {
        console.error('Error adding vehicle:', err);
        throw err;
      }
    },
    [lessorId]
  );

  // Update vehicle
  const updateVehicle = useCallback(
    async (id: string, updates: Partial<CreateVehicleInput>) => {
      try {
        const { data, error: err } = await supabase
          .from('vehicles')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (err) throw err;
        setVehicles((prev) =>
          prev.map((v) => (v.id === id ? (data as Vehicle) : v))
        );
        return data;
      } catch (err) {
        console.error('Error updating vehicle:', err);
        throw err;
      }
    },
    []
  );

  // Delete vehicle
  const deleteVehicle = useCallback(async (id: string) => {
    try {
      const { error: err } = await supabase.from('vehicles').delete().eq('id', id);

      if (err) throw err;
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      throw err;
    }
  }, []);

  // Update availability status
  const updateStatus = useCallback(
    async (
      id: string,
      status: 'available' | 'rented' | 'maintenance' | 'retired'
    ) => {
      return updateVehicle(id, { status } as any);
    },
    [updateVehicle]
  );

  return {
    vehicles,
    loading,
    error,
    refetch: fetch,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    updateStatus,
  };
}
