import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaymentResult {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  subscriptionId?: string;
  paymentType?: 'one_time' | 'subscription';
  mode?: 'gateway' | 'p2p';
  message?: string;
  error?: string;
}

export const usePayments = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const initiatePayment = async (bookingId: string, returnUrl?: string): Promise<PaymentResult> => {
    setIsProcessing(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Du skal være logget ind');
        return { success: false, error: 'Not authenticated' };
      }

      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: { 
          bookingId,
          returnUrl: returnUrl || `${window.location.origin}/my-rentals?payment=success`,
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.mode === 'p2p') {
        // P2P mode - LEJIO handles payment
        toast.success('Betaling håndteres af LEJIO');
        return {
          success: true,
          mode: 'p2p',
          message: data.message,
        };
      }

      // Gateway mode - redirect to payment page
      if (data.paymentUrl) {
        return {
          success: true,
          mode: 'gateway',
          paymentUrl: data.paymentUrl,
          transactionId: data.transactionId,
          subscriptionId: data.subscriptionId,
          paymentType: data.paymentType,
        };
      }

      return { success: true };
    } catch (err) {
      console.error('Payment error:', err);
      const message = err instanceof Error ? err.message : 'Ukendt fejl';
      toast.error(`Betalingsfejl: ${message}`);
      return { success: false, error: message };
    } finally {
      setIsProcessing(false);
    }
  };

  const redirectToPayment = async (bookingId: string) => {
    const result = await initiatePayment(bookingId);
    
    if (result.success && result.paymentUrl) {
      // Redirect to payment gateway
      window.location.href = result.paymentUrl;
    }
    
    return result;
  };

  return {
    isProcessing,
    initiatePayment,
    redirectToPayment,
  };
};