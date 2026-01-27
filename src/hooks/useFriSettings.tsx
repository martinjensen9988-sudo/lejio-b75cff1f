import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LessorAccount {
  id: string;
  user_id: string;
  company_name: string;
  custom_domain?: string;
  cvr_number?: string;
  subscription_tier: 'trial' | 'professional' | 'business' | 'enterprise';
  trial_expires_at?: string;
  subscription_started_at?: string;
  stripe_customer_id?: string;
  branding: {
    primary_color?: string;
    logo_url?: string;
    company_name?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface UpdateAccountInput {
  company_name?: string;
  custom_domain?: string;
  cvr_number?: string;
}

export interface UpdateBrandingInput {
  primary_color?: string;
  logo_url?: string;
}

export function useFriSettings(userId: string | null) {
  const [account, setAccount] = useState<LessorAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch account settings
  const fetch = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;
      
      // Transform the data to match our interface
      if (data) {
        setAccount({
          id: data.id,
          user_id: data.id,
          company_name: data.full_name || '',
          custom_domain: data.metadata?.custom_domain,
          cvr_number: data.metadata?.cvr_number,
          subscription_tier: data.metadata?.subscription_tier || 'trial',
          trial_expires_at: data.metadata?.trial_expires_at,
          subscription_started_at: data.metadata?.subscription_started_at,
          stripe_customer_id: data.metadata?.stripe_customer_id,
          branding: data.metadata?.branding || {},
          created_at: data.created_at,
          updated_at: data.updated_at,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch settings';
      setError(message);
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Auto-fetch when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      fetch();
    }
  }, [userId, fetch]);

  // Update account settings
  const updateAccount = useCallback(
    async (input: UpdateAccountInput) => {
      if (!userId) throw new Error('User ID is required');

      try {
        setError(null);
        setSuccess(null);

        const { data, error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: input.company_name || account?.company_name,
            metadata: {
              ...account?.branding,
              custom_domain: input.custom_domain,
              cvr_number: input.cvr_number,
              subscription_tier: account?.subscription_tier,
              trial_expires_at: account?.trial_expires_at,
              subscription_started_at: account?.subscription_started_at,
              stripe_customer_id: account?.stripe_customer_id,
              branding: account?.branding,
            },
          })
          .eq('id', userId)
          .select()
          .single();

        if (updateError) throw updateError;

        if (data) {
          setAccount({
            id: data.id,
            user_id: data.id,
            company_name: data.full_name || '',
            custom_domain: data.metadata?.custom_domain,
            cvr_number: data.metadata?.cvr_number,
            subscription_tier: data.metadata?.subscription_tier || 'trial',
            trial_expires_at: data.metadata?.trial_expires_at,
            subscription_started_at: data.metadata?.subscription_started_at,
            stripe_customer_id: data.metadata?.stripe_customer_id,
            branding: data.metadata?.branding || {},
            created_at: data.created_at,
            updated_at: data.updated_at,
          });
          setSuccess('Indstillinger gemt');
        }

        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update settings';
        setError(message);
        throw err;
      }
    },
    [userId, account]
  );

  // Update branding
  const updateBranding = useCallback(
    async (input: UpdateBrandingInput) => {
      if (!userId || !account) throw new Error('User ID and account are required');

      try {
        setError(null);
        setSuccess(null);

        const newBranding = {
          ...account.branding,
          ...input,
        };

        const { data, error: updateError } = await supabase
          .from('profiles')
          .update({
            metadata: {
              custom_domain: account.custom_domain,
              cvr_number: account.cvr_number,
              subscription_tier: account.subscription_tier,
              trial_expires_at: account.trial_expires_at,
              subscription_started_at: account.subscription_started_at,
              stripe_customer_id: account.stripe_customer_id,
              branding: newBranding,
            },
          })
          .eq('id', userId)
          .select()
          .single();

        if (updateError) throw updateError;

        if (data) {
          setAccount({
            id: data.id,
            user_id: data.id,
            company_name: data.full_name || '',
            custom_domain: data.metadata?.custom_domain,
            cvr_number: data.metadata?.cvr_number,
            subscription_tier: data.metadata?.subscription_tier || 'trial',
            trial_expires_at: data.metadata?.trial_expires_at,
            subscription_started_at: data.metadata?.subscription_started_at,
            stripe_customer_id: data.metadata?.stripe_customer_id,
            branding: data.metadata?.branding || {},
            created_at: data.created_at,
            updated_at: data.updated_at,
          });
          setSuccess('Branding gemt');
        }

        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update branding';
        setError(message);
        throw err;
      }
    },
    [userId, account]
  );

  // Check if trial is expired
  const isTrialExpired = (): boolean => {
    if (account?.subscription_tier !== 'trial' || !account?.trial_expires_at) {
      return false;
    }
    return new Date(account.trial_expires_at) < new Date();
  };

  // Get days remaining in trial
  const getTrialDaysRemaining = (): number => {
    if (account?.subscription_tier !== 'trial' || !account?.trial_expires_at) {
      return 0;
    }
    const now = new Date();
    const expiresAt = new Date(account.trial_expires_at);
    const diffTime = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Dismiss error
  const dismissError = () => setError(null);
  const dismissSuccess = () => setSuccess(null);

  return {
    account,
    loading,
    error,
    success,
    refetch: fetch,
    updateAccount,
    updateBranding,
    isTrialExpired,
    getTrialDaysRemaining,
    dismissError,
    dismissSuccess,
  };
}
