import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Dealer Location Management Hook

export interface DealerLocation {
  id: string;
  partner_id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  is_headquarters: boolean;
  latitude: number | null;
  longitude: number | null;
  preparation_time_minutes: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  opening_hours?: LocationOpeningHours[];
  special_days?: LocationSpecialDay[];
}

export interface LocationOpeningHours {
  id: string;
  location_id: string;
  day_of_week: number; // 0=Sunday, 1=Monday...6=Saturday
  opens_at: string | null;
  closes_at: string | null;
  is_closed: boolean;
}

export interface LocationSpecialDay {
  id: string;
  location_id: string;
  date: string;
  is_closed: boolean;
  opens_at: string | null;
  closes_at: string | null;
  reason: string | null;
  created_at: string;
}

export interface CreateLocationInput {
  partner_id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  phone?: string;
  email?: string;
  is_headquarters?: boolean;
  preparation_time_minutes?: number;
  notes?: string;
}

export interface UpdateLocationInput extends Partial<CreateLocationInput> {
  is_active?: boolean;
  latitude?: number;
  longitude?: number;
}

const DAY_NAMES = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];

export const useDealerLocations = (partnerId?: string) => {
  const [locations, setLocations] = useState<DealerLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = (supabase
        .from('dealer_locations' as any)
        .select('*')
        .order('is_headquarters', { ascending: false })
        .order('name')) as any;

      if (partnerId) {
        query = query.eq('partner_id', partnerId);
      }

      const { data: locationsData, error: locationsError } = await query;

      if (locationsError) throw locationsError;

      // Fetch opening hours for all locations
      const locationIds = ((locationsData || []) as any[]).map((l: any) => l.id);
      
      if (locationIds.length > 0) {
        const { data: hoursData } = await (supabase
          .from('location_opening_hours' as any)
          .select('*')
          .in('location_id', locationIds) as any);

        const { data: specialDaysData } = await (supabase
          .from('location_special_days' as any)
          .select('*')
          .in('location_id', locationIds)
          .gte('date', new Date().toISOString().split('T')[0]) as any);

        const locationsWithHours = (locationsData || []).map(loc => ({
          ...loc,
          opening_hours: (hoursData || []).filter(h => h.location_id === loc.id),
          special_days: (specialDaysData || []).filter(d => d.location_id === loc.id),
        }));

        setLocations(locationsWithHours);
      } else {
        setLocations([]);
      }
    } catch (err: any) {
      console.error('Error fetching locations:', err);
      setError(err.message);
      toast.error('Kunne ikke hente lokationer');
    } finally {
      setIsLoading(false);
    }
  }, [partnerId]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const createLocation = async (input: CreateLocationInput): Promise<DealerLocation | null> => {
    try {
      const { data, error } = await (supabase
        .from('dealer_locations' as any)
        .insert(input as any)
        .select()
        .single() as any);

      if (error) throw error;

      // Create default opening hours (Mon-Fri 8-17, Sat 9-14, Sun closed)
      const defaultHours = [
        { location_id: data.id, day_of_week: 0, is_closed: true, opens_at: null, closes_at: null }, // Sunday
        { location_id: data.id, day_of_week: 1, is_closed: false, opens_at: '08:00', closes_at: '17:00' },
        { location_id: data.id, day_of_week: 2, is_closed: false, opens_at: '08:00', closes_at: '17:00' },
        { location_id: data.id, day_of_week: 3, is_closed: false, opens_at: '08:00', closes_at: '17:00' },
        { location_id: data.id, day_of_week: 4, is_closed: false, opens_at: '08:00', closes_at: '17:00' },
        { location_id: data.id, day_of_week: 5, is_closed: false, opens_at: '08:00', closes_at: '17:00' },
        { location_id: data.id, day_of_week: 6, is_closed: false, opens_at: '09:00', closes_at: '14:00' }, // Saturday
      ];

      await (supabase.from('location_opening_hours' as any).insert(defaultHours as any) as any);

      toast.success('Lokation oprettet');
      await fetchLocations();
      return data as DealerLocation;
    } catch (err: any) {
      console.error('Error creating location:', err);
      toast.error('Kunne ikke oprette lokation: ' + err.message);
      return null;
    }
  };

  const updateLocation = async (locationId: string, input: UpdateLocationInput): Promise<boolean> => {
    try {
      const { error } = await (supabase
        .from('dealer_locations' as any)
        .update(input as any)
        .eq('id', locationId) as any);

      if (error) throw error;

      toast.success('Lokation opdateret');
      await fetchLocations();
      return true;
    } catch (err: any) {
      console.error('Error updating location:', err);
      toast.error('Kunne ikke opdatere lokation: ' + err.message);
      return false;
    }
  };

  const deleteLocation = async (locationId: string): Promise<boolean> => {
    try {
      const { error } = await (supabase
        .from('dealer_locations' as any)
        .delete()
        .eq('id', locationId) as any);

      if (error) throw error;

      toast.success('Lokation slettet');
      await fetchLocations();
      return true;
    } catch (err: any) {
      console.error('Error deleting location:', err);
      toast.error('Kunne ikke slette lokation: ' + err.message);
      return false;
    }
  };

  const updateOpeningHours = async (
    locationId: string,
    hours: Omit<LocationOpeningHours, 'id' | 'location_id'>[]
  ): Promise<boolean> => {
    try {
      // Delete existing hours
      await (supabase
        .from('location_opening_hours' as any)
        .delete()
        .eq('location_id', locationId) as any);

      // Insert new hours
      const hoursWithLocationId = hours.map(h => ({
        ...h,
        location_id: locationId,
      }));

      const { error } = await (supabase
        .from('location_opening_hours' as any)
        .insert(hoursWithLocationId as any) as any);

      if (error) throw error;

      toast.success('Åbningstider opdateret');
      await fetchLocations();
      return true;
    } catch (err: any) {
      console.error('Error updating opening hours:', err);
      toast.error('Kunne ikke opdatere åbningstider: ' + err.message);
      return false;
    }
  };

  const addSpecialDay = async (
    locationId: string,
    input: Omit<LocationSpecialDay, 'id' | 'location_id' | 'created_at'>
  ): Promise<boolean> => {
    try {
      const { error } = await (supabase
        .from('location_special_days' as any)
        .insert({ ...input, location_id: locationId } as any) as any);

      if (error) throw error;

      toast.success('Særlig dag tilføjet');
      await fetchLocations();
      return true;
    } catch (err: any) {
      console.error('Error adding special day:', err);
      toast.error('Kunne ikke tilføje særlig dag: ' + err.message);
      return false;
    }
  };

  const removeSpecialDay = async (specialDayId: string): Promise<boolean> => {
    try {
      const { error } = await (supabase
        .from('location_special_days' as any)
        .delete()
        .eq('id', specialDayId) as any);

      if (error) throw error;

      toast.success('Særlig dag fjernet');
      await fetchLocations();
      return true;
    } catch (err: any) {
      console.error('Error removing special day:', err);
      toast.error('Kunne ikke fjerne særlig dag: ' + err.message);
      return false;
    }
  };

  const checkLocationOpen = async (locationId: string, datetime: Date): Promise<boolean> => {
    try {
      const { data, error } = await (supabase.rpc('is_location_open' as any, {
        _location_id: locationId,
        _datetime: datetime.toISOString(),
      }) as any);

      if (error) throw error;
      return data === true;
    } catch (err: any) {
      console.error('Error checking location open:', err);
      return false;
    }
  };

  return {
    locations,
    isLoading,
    error,
    fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    updateOpeningHours,
    addSpecialDay,
    removeSpecialDay,
    checkLocationOpen,
    DAY_NAMES,
  };
};
