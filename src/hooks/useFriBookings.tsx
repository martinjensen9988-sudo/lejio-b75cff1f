import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Booking {
  id: string;
  lessor_id: string;
  vehicle_id: string;
  vehicle_make?: string;
  vehicle_model?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_price?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingInput {
  vehicle_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  start_date: string;
  end_date: string;
  total_price?: number;
  notes?: string;
}

export function useFriBookings(lessorId: string | null) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all bookings for the lessor
  const fetch = useCallback(async () => {
    if (!lessorId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('lessor_bookings')
        .select('*')
        .eq('lessor_id', lessorId)
        .order('start_date', { ascending: false });

      if (fetchError) throw fetchError;
      setBookings(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch bookings';
      setError(message);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [lessorId]);

  // Auto-fetch when component mounts or lessorId changes
  useEffect(() => {
    if (lessorId) {
      fetch();
    }
  }, [lessorId, fetch]);

  // Create a new booking
  const addBooking = useCallback(
    async (input: CreateBookingInput) => {
      if (!lessorId) throw new Error('Lessor ID is required');

      try {
        setError(null);

        const { data, error: insertError } = await supabase
          .from('lessor_bookings')
          .insert({
            lessor_id: lessorId,
            ...input,
            status: 'pending',
          })
          .select();

        if (insertError) throw insertError;

        if (data && data[0]) {
          setBookings((prev) => [data[0], ...prev]);
        }

        return data?.[0];
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create booking';
        setError(message);
        throw err;
      }
    },
    [lessorId]
  );

  // Update a booking
  const updateBooking = useCallback(
    async (id: string, input: Partial<CreateBookingInput>) => {
      if (!lessorId) throw new Error('Lessor ID is required');

      try {
        setError(null);

        const { data, error: updateError } = await supabase
          .from('lessor_bookings')
          .update(input)
          .eq('id', id)
          .eq('lessor_id', lessorId)
          .select();

        if (updateError) throw updateError;

        if (data && data[0]) {
          setBookings((prev) =>
            prev.map((b) => (b.id === id ? data[0] : b))
          );
        }

        return data?.[0];
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update booking';
        setError(message);
        throw err;
      }
    },
    [lessorId]
  );

  // Delete a booking
  const deleteBooking = useCallback(
    async (id: string) => {
      if (!lessorId) throw new Error('Lessor ID is required');

      try {
        setError(null);

        const { error: deleteError } = await supabase
          .from('lessor_bookings')
          .delete()
          .eq('id', id)
          .eq('lessor_id', lessorId);

        if (deleteError) throw deleteError;

        setBookings((prev) => prev.filter((b) => b.id !== id));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete booking';
        setError(message);
        throw err;
      }
    },
    [lessorId]
  );

  // Update booking status
  const updateStatus = useCallback(
    async (id: string, status: Booking['status']) => {
      return updateBooking(id, { status });
    },
    [updateBooking]
  );

  // Calculate days between dates
  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  return {
    bookings,
    loading,
    error,
    refetch: fetch,
    addBooking,
    updateBooking,
    deleteBooking,
    updateStatus,
    calculateDays,
  };
}
