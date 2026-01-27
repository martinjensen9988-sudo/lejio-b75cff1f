import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Payment {
  id: string;
  lessor_id: string;
  lessor_name: string;
  lessor_email: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: 'card' | 'bank_transfer' | 'paypal';
  subscription_type: 'trial' | 'monthly' | 'yearly';
  reference: string;
  notes: string;
  created_at: string;
  updated_at: string;
  paid_at?: string;
}

export interface PaymentStats {
  total_revenue: number;
  completed_payments: number;
  pending_payments: number;
  failed_payments: number;
  avg_payment: number;
  monthly_data: { month: string; revenue: number }[];
}

interface UseFriPaymentsReturn {
  payments: Payment[];
  stats: PaymentStats | null;
  loading: boolean;
  error: string | null;
  fetchPayments: (filter?: string) => Promise<void>;
  getPaymentStats: () => Promise<PaymentStats | null>;
  updatePaymentStatus: (paymentId: string, status: Payment['status']) => Promise<void>;
  recordManualPayment: (lessorId: string, amount: number, method: string, notes: string) => Promise<void>;
}

export const useFriPayments = (): UseFriPaymentsReturn => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async (filter?: string) => {
    try {
      setError(null);
      setLoading(true);

      let query = supabase
        .from('fri_payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter && filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error: err } = await query;

      if (err) throw new Error(err.message);
      setPayments(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fejl ved indlæsning af betalinger';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStats = async (): Promise<PaymentStats | null> => {
    try {
      const { data, error: err } = await supabase
        .from('fri_payments')
        .select('*');

      if (err) throw new Error(err.message);

      const paymentsData = data || [];

      const totalRevenue = paymentsData
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);

      const completedPayments = paymentsData.filter(p => p.status === 'completed').length;
      const pendingPayments = paymentsData.filter(p => p.status === 'pending').length;
      const failedPayments = paymentsData.filter(p => p.status === 'failed').length;
      const avgPayment = completedPayments > 0 ? totalRevenue / completedPayments : 0;

      // Calculate monthly data
      const monthlyMap = new Map<string, number>();
      paymentsData
        .filter(p => p.status === 'completed')
        .forEach(payment => {
          const month = new Date(payment.created_at).toLocaleDateString('da-DK', {
            year: 'numeric',
            month: 'short',
          });
          monthlyMap.set(month, (monthlyMap.get(month) || 0) + payment.amount);
        });

      const monthlyData = Array.from(monthlyMap.entries())
        .map(([month, revenue]) => ({ month, revenue }))
        .slice(-12);

      const statsData: PaymentStats = {
        total_revenue: totalRevenue,
        completed_payments: completedPayments,
        pending_payments: pendingPayments,
        failed_payments: failedPayments,
        avg_payment: avgPayment,
        monthly_data: monthlyData,
      };

      setStats(statsData);
      return statsData;
    } catch (err) {
      console.error('Error fetching payment stats:', err);
      return null;
    }
  };

  const updatePaymentStatus = async (paymentId: string, status: Payment['status']) => {
    try {
      const { error: err } = await supabase
        .from('fri_payments')
        .update({
          status,
          updated_at: new Date().toISOString(),
          paid_at: status === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', paymentId);

      if (err) throw new Error(err.message);

      setPayments(payments.map(p =>
        p.id === paymentId
          ? {
              ...p,
              status,
              updated_at: new Date().toISOString(),
              paid_at: status === 'completed' ? new Date().toISOString() : undefined,
            }
          : p
      ));

      // Update stats
      await getPaymentStats();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fejl ved opdatering af betaling';
      setError(message);
      throw err;
    }
  };

  const recordManualPayment = async (lessorId: string, amount: number, method: string, notes: string) => {
    try {
      const { error: err } = await supabase
        .from('fri_payments')
        .insert({
          lessor_id: lessorId,
          amount,
          currency: 'DKK',
          status: 'completed',
          payment_method: method,
          subscription_type: 'monthly',
          reference: `MANUAL-${Date.now()}`,
          notes,
          paid_at: new Date().toISOString(),
        });

      if (err) throw new Error(err.message);

      // Reload payments
      await fetchPayments();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fejl ved registrering af betaling';
      setError(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchPayments();
    getPaymentStats();
  }, []);

  return {
    payments,
    stats,
    loading,
    error,
    fetchPayments,
    getPaymentStats,
    updatePaymentStatus,
    recordManualPayment,
  };
};
