import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/azure/client';

export interface FriLessor {
  id: string;
  email: string;
  company_name: string;
  cvr_number: string;
  custom_domain: string;
  primary_color: string;
  logo_url: string;
  trial_start_date: string;
  trial_end_date: string;
  subscription_status: 'trial' | 'active' | 'suspended' | 'cancelled';
  created_at: string;
}

export interface LessorStats {
  total_vehicles: number;
  total_bookings: number;
  total_revenue: number;
  total_invoices: number;
  active_bookings: number;
}

interface UseFriAdminLessorsReturn {
  lessors: FriLessor[];
  loading: boolean;
  error: string | null;
  stats: { [key: string]: LessorStats };
  fetchLessors: () => Promise<void>;
  getLessorStats: (lessorId: string) => Promise<LessorStats | null>;
  suspendLessor: (lessorId: string) => Promise<void>;
  activateLessor: (lessorId: string) => Promise<void>;
  deleteLessor: (lessorId: string) => Promise<void>;
}

export const useFriAdminLessors = (): UseFriAdminLessorsReturn => {
  const [lessors, setLessors] = useState<FriLessor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ [key: string]: LessorStats }>({});

  const fetchLessors = async () => {
    try {
      setError(null);
      setLoading(true);

      const { data, error: err } = await supabase
        .from('fri_lessors')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw new Error(err.message);
      setLessors(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch lessors';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getLessorStats = async (lessorId: string): Promise<LessorStats | null> => {
    try {
      const [vehiclesRes, bookingsRes, invoicesRes, activeBookingsRes] = await Promise.all([
        supabase
          .from('fri_vehicles')
          .select('id')
          .eq('lessor_id', lessorId),
        supabase
          .from('fri_bookings')
          .select('id, total_price')
          .eq('lessor_id', lessorId),
        supabase
          .from('fri_invoices')
          .select('id')
          .eq('lessor_id', lessorId),
        supabase
          .from('fri_bookings')
          .select('id')
          .eq('lessor_id', lessorId)
          .eq('status', 'confirmed'),
      ]);

      const totalVehicles = vehiclesRes.data?.length || 0;
      const totalBookings = bookingsRes.data?.length || 0;
      const totalRevenue = bookingsRes.data?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;
      const totalInvoices = invoicesRes.data?.length || 0;
      const activeBookings = activeBookingsRes.data?.length || 0;

      const lessorStats: LessorStats = {
        total_vehicles: totalVehicles,
        total_bookings: totalBookings,
        total_revenue: totalRevenue,
        total_invoices: totalInvoices,
        active_bookings: activeBookings,
      };

      setStats(prev => ({ ...prev, [lessorId]: lessorStats }));
      return lessorStats;
    } catch (err) {
      console.error('Error fetching lessor stats:', err);
      return null;
    }
  };

  const suspendLessor = async (lessorId: string) => {
    try {
      const { error: err } = await supabase
        .from('fri_lessors')
        .update({ subscription_status: 'suspended' })
        .eq('id', lessorId);

      if (err) throw new Error(err.message);

      setLessors(lessors.map(l => 
        l.id === lessorId ? { ...l, subscription_status: 'suspended' } : l
      ));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to suspend lessor';
      setError(message);
      throw err;
    }
  };

  const activateLessor = async (lessorId: string) => {
    try {
      const { error: err } = await supabase
        .from('fri_lessors')
        .update({ subscription_status: 'active' })
        .eq('id', lessorId);

      if (err) throw new Error(err.message);

      setLessors(lessors.map(l => 
        l.id === lessorId ? { ...l, subscription_status: 'active' } : l
      ));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to activate lessor';
      setError(message);
      throw err;
    }
  };

  const deleteLessor = async (lessorId: string) => {
    try {
      const { error: err } = await supabase
        .from('fri_lessors')
        .delete()
        .eq('id', lessorId);

      if (err) throw new Error(err.message);

      setLessors(lessors.filter(l => l.id !== lessorId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete lessor';
      setError(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchLessors();
  }, []);

  return {
    lessors,
    loading,
    error,
    stats,
    fetchLessors,
    getLessorStats,
    suspendLessor,
    activateLessor,
    deleteLessor,
  };
};
