import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Booking {
  id: string;
  vehicle_id: string;
  renter_id: string | null;
  lessor_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  renter_name: string | null;
  renter_email: string | null;
  renter_phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  vehicle?: {
    registration: string;
    make: string;
    model: string;
  };
}

export const useBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!user) {
      setBookings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          *,
          vehicle:vehicles(registration, make, model)
        `)
        .eq('lessor_id', user.id)
        .order('start_date', { ascending: false });

      if (fetchError) throw fetchError;
      // Cast the status field to the correct type
      const typedData = (data || []).map(booking => ({
        ...booking,
        status: booking.status as Booking['status'],
      }));
      setBookings(typedData);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Kunne ikke hente bookinger');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (updateError) throw updateError;

      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      toast.success(`Booking ${status === 'confirmed' ? 'bekræftet' : status === 'cancelled' ? 'annulleret' : 'opdateret'}`);
      return true;
    } catch (err) {
      console.error('Error updating booking:', err);
      toast.error('Kunne ikke opdatere booking');
      return false;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  return {
    bookings,
    isLoading,
    error,
    updateBookingStatus,
    refetch: fetchBookings,
  };
};
