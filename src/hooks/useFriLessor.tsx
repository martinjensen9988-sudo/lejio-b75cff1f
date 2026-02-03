import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/azure/client';
import { useFriAuth } from '@/hooks/useFriAuth';
import { toast } from 'sonner';

export interface FriLessor {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  billing_address: string | null;
  status: 'active' | 'suspended' | 'cancelled';
  created_at: string;
}

export interface FriTeamMember {
  id: string;
  lessor_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: 'manager' | 'driver' | 'mechanic' | 'accountant';
  is_active: boolean;
  created_at: string;
}

export interface FriVehicle {
  id: string;
  lessor_id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  daily_rate: number;
  image_url: string | null;
  status: 'available' | 'booked' | 'maintenance' | 'retired';
  created_at: string;
}

export interface FriBooking {
  id: string;
  lessor_id: string;
  vehicle_id: string;
  renter_name: string;
  renter_phone: string | null;
  renter_email: string;
  start_date: string;
  end_date: string;
  daily_rate: number;
  additional_fees: number | null;
  total_price: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  created_at: string;
}

export interface FriInvoice {
  id: string;
  lessor_id: string;
  booking_id: string;
  invoice_number: string;
  total_amount: number;
  status: 'draft' | 'pending' | 'sent' | 'paid';
  created_at: string;
  due_date: string;
  paid_date?: string;
}

export const useFriLessor = () => {
  const { token, lessorId } = useFriAuth();
  const [friLessor, setFriLessor] = useState<FriLessor | null>(null);
  const [teamMembers, setTeamMembers] = useState<FriTeamMember[]>([]);
  const [vehicles, setVehicles] = useState<FriVehicle[]>([]);
  const [bookings, setBookings] = useState<FriBooking[]>([]);
  const [invoices, setInvoices] = useState<FriInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFriData = useCallback(async () => {
    if (!token || !lessorId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch all related data in parallel
      const [lessorRes, teamRes, vehiclesRes, bookingsRes, invoicesRes] = await Promise.all([
        supabase.from('fri_lessors').select('*').eq('id', lessorId).maybeSingle(),
        supabase.from('fri_lessor_team_members').select('*').eq('lessor_id', lessorId).eq('is_active', true),
        supabase.from('fri_vehicles').select('*').eq('lessor_id', lessorId).order('created_at', { ascending: false }),
        supabase.from('fri_bookings').select('*').eq('lessor_id', lessorId).order('created_at', { ascending: false }).limit(100),
        supabase.from('fri_invoices').select('*').eq('lessor_id', lessorId).order('created_at', { ascending: false }),
      ]);

      if (lessorRes.data) setFriLessor(lessorRes.data as FriLessor);
      if (teamRes.data) setTeamMembers(teamRes.data as FriTeamMember[]);
      if (vehiclesRes.data) setVehicles(vehiclesRes.data as FriVehicle[]);
      if (bookingsRes.data) setBookings(bookingsRes.data as FriBooking[]);
      if (invoicesRes.data) setInvoices(invoicesRes.data as FriInvoice[]);

    } catch (error) {
      console.error('Error fetching Fri data:', error);
      toast.error('Kunne ikke hente data');
    } finally {
      setIsLoading(false);
    }
  }, [token, lessorId]);

  useEffect(() => {
    fetchFriData();
  }, [fetchFriData]);

  const createTeamMember = async (member: { full_name: string; email: string; phone?: string; role: 'manager' | 'driver' | 'mechanic' | 'accountant' }) => {
    if (!lessorId) {
      toast.error('Lessor ID ikke fundet');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('fri_lessor_team_members')
        .insert({
          lessor_id: lessorId,
          full_name: member.full_name,
          email: member.email,
          phone: member.phone || null,
          role: member.role,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Teammedlem oprettet');
      await fetchFriData();
      return data;
    } catch (error) {
      console.error('Error creating team member:', error);
      toast.error('Kunne ikke oprette teammedlem');
      return null;
    }
  };

  const updateTeamMember = async (memberId: string, updates: Partial<FriTeamMember>) => {
    try {
      const { error } = await supabase
        .from('fri_lessor_team_members')
        .update(updates)
        .eq('id', memberId);

      if (error) throw error;

      toast.success('Teammedlem opdateret');
      await fetchFriData();
      return true;
    } catch (error) {
      console.error('Error updating team member:', error);
      toast.error('Kunne ikke opdatere teammedlem');
      return false;
    }
  };

  const deleteTeamMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('fri_lessor_team_members')
        .update({ is_active: false })
        .eq('id', memberId);

      if (error) throw error;

      toast.success('Teammedlem slettet');
      await fetchFriData();
      return true;
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Kunne ikke slette teammedlem');
      return false;
    }
  };

  const createVehicle = async (vehicle: { make: string; model: string; year: number; license_plate: string; daily_rate: number }) => {
    if (!lessorId) {
      toast.error('Lessor ID ikke fundet');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('fri_vehicles')
        .insert({
          lessor_id: lessorId,
          ...vehicle,
          status: 'available',
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Køretøj oprettet');
      await fetchFriData();
      return data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      toast.error('Kunne ikke oprette køretøj');
      return null;
    }
  };

  const updateVehicle = async (vehicleId: string, updates: Partial<FriVehicle>) => {
    try {
      const { error } = await supabase
        .from('fri_vehicles')
        .update(updates)
        .eq('id', vehicleId);

      if (error) throw error;

      toast.success('Køretøj opdateret');
      await fetchFriData();
      return true;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Kunne ikke opdatere køretøj');
      return false;
    }
  };

  const createBooking = async (booking: { vehicle_id: string; renter_name: string; renter_email: string; renter_phone?: string; start_date: string; end_date: string; daily_rate: number; additional_fees?: number }) => {
    if (!lessorId) {
      toast.error('Lessor ID ikke fundet');
      return null;
    }

    try {
      const daysBooked = Math.ceil(
        (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / 
        (1000 * 60 * 60 * 24)
      );
      const totalPrice = (booking.daily_rate * daysBooked) + (booking.additional_fees || 0);

      const { data, error } = await supabase
        .from('fri_bookings')
        .insert({
          lessor_id: lessorId,
          vehicle_id: booking.vehicle_id,
          renter_name: booking.renter_name,
          renter_email: booking.renter_email,
          renter_phone: booking.renter_phone || null,
          start_date: booking.start_date,
          end_date: booking.end_date,
          daily_rate: booking.daily_rate,
          additional_fees: booking.additional_fees || 0,
          total_price: totalPrice,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Booking oprettet');
      await fetchFriData();
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Kunne ikke oprette booking');
      return null;
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: FriBooking['status']) => {
    try {
      const { error } = await supabase
        .from('fri_bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success('Booking status opdateret');
      await fetchFriData();
      return true;
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Kunne ikke opdatere booking');
      return false;
    }
  };

  const getVehicleUtilization = () => {
    if (vehicles.length === 0) return 0;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentBookings = bookings.filter((b) => new Date(b.created_at) >= thirtyDaysAgo);
    const vehiclesUsed = new Set(recentBookings.map((b) => b.vehicle_id)).size;

    return Math.round((vehiclesUsed / vehicles.length) * 100);
  };

  const getTotalMonthlyRevenue = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return bookings
      .filter((b) => {
        const bookDate = new Date(b.created_at);
        return bookDate >= monthStart && bookDate <= monthEnd && b.status === 'completed';
      })
      .reduce((sum, b) => sum + b.total_price, 0);
  };

  const getVehicleRevenue = (vehicleId: string) => {
    return bookings
      .filter((b) => b.vehicle_id === vehicleId && b.status === 'completed')
      .reduce((sum, b) => sum + b.total_price, 0);
  };

  return {
    friLessor,
    teamMembers,
    vehicles,
    bookings,
    invoices,
    isLoading,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    createVehicle,
    updateVehicle,
    createBooking,
    updateBookingStatus,
    getVehicleUtilization,
    getTotalMonthlyRevenue,
    getVehicleRevenue,
    refetch: fetchFriData,
  };
};
