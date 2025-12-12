import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PaymentSettings {
  id?: string;
  lessor_id: string;
  payment_gateway: string | null;
  gateway_api_key: string | null;
  gateway_merchant_id: string | null;
  bank_account: string | null;
}

export const usePaymentSettings = () => {
  const { user } = useAuth();
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPaymentSettings();
    } else {
      setPaymentSettings(null);
      setLoading(false);
    }
  }, [user]);

  const fetchPaymentSettings = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('lessor_payment_settings')
      .select('*')
      .eq('lessor_id', user.id)
      .maybeSingle();

    if (data && !error) {
      setPaymentSettings(data as PaymentSettings);
    }
    setLoading(false);
  };

  const updatePaymentSettings = async (updates: Partial<PaymentSettings>) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Check if record exists
    const { data: existing } = await supabase
      .from('lessor_payment_settings')
      .select('id')
      .eq('lessor_id', user.id)
      .maybeSingle();

    let error;

    if (existing) {
      // Update existing record
      const result = await supabase
        .from('lessor_payment_settings')
        .update(updates)
        .eq('lessor_id', user.id);
      error = result.error;
    } else {
      // Insert new record
      const result = await supabase
        .from('lessor_payment_settings')
        .insert({
          lessor_id: user.id,
          ...updates,
        });
      error = result.error;
    }

    if (!error) {
      setPaymentSettings(prev => prev 
        ? { ...prev, ...updates } 
        : { lessor_id: user.id, payment_gateway: null, gateway_api_key: null, gateway_merchant_id: null, bank_account: null, ...updates }
      );
    }

    return { error };
  };

  return {
    paymentSettings,
    loading,
    updatePaymentSettings,
    refetch: fetchPaymentSettings,
  };
};
