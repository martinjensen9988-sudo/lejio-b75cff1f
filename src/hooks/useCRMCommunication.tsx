import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CallResult {
  success: boolean;
  callSid?: string;
  error?: string;
}

interface EmailResult {
  success: boolean;
  error?: string;
}

export const useCRMCommunication = () => {
  const [isCallingInProgress, setIsCallingInProgress] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  const makeCall = useCallback(async (params: {
    to: string;
    dealId?: string;
    leadId?: string;
    contactName?: string;
  }): Promise<CallResult> => {
    setIsCallingInProgress(true);
    try {
      const { data, error } = await supabase.functions.invoke('twilio-make-call', {
        body: params,
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: 'Opkald startet',
          description: `Ringer til ${params.contactName || params.to}`,
        });
        return { success: true, callSid: data.callSid };
      } else {
        throw new Error(data?.error || 'Kunne ikke starte opkald');
      }
    } catch (error: any) {
      console.error('Error making call:', error);
      toast({
        title: 'Fejl ved opkald',
        description: error.message || 'Kunne ikke starte opkald',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setIsCallingInProgress(false);
    }
  }, [toast]);

  const sendEmail = useCallback(async (params: {
    recipientEmail: string;
    recipientName?: string;
    subject: string;
    body: string;
    dealId?: string;
    leadId?: string;
  }): Promise<EmailResult> => {
    setIsSendingEmail(true);
    try {
      const { data, error } = await supabase.functions.invoke('crm-send-email', {
        body: params,
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: 'Email sendt',
          description: `Email sendt til ${params.recipientName || params.recipientEmail}`,
        });
        return { success: true };
      } else {
        throw new Error(data?.error || 'Kunne ikke sende email');
      }
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        title: 'Fejl ved afsendelse',
        description: error.message || 'Kunne ikke sende email',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setIsSendingEmail(false);
    }
  }, [toast]);

  return {
    makeCall,
    sendEmail,
    isCallingInProgress,
    isSendingEmail,
  };
};
