import { useState, useCallback } from 'react';
import { queryAzure } from '@/integrations/azure/clientFri';

interface CreateLessorAccountInput {
  userId: string;
  email: string;
  companyName: string;
  cvr?: string;
  customDomain: string;
  primaryColor?: string;
}

interface CreateLessorAccountOutput {
  id: string;
  user_id: string;
  company_name: string;
  custom_domain: string;
  subscription_tier: string;
  created_at: string;
}

/**
 * Create a new lessor account in Azure
 * Called during signup after user is created in Supabase
 */
export function useCreateLessorAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createAccount = useCallback(
    async (input: CreateLessorAccountInput): Promise<CreateLessorAccountOutput | null> => {
      setLoading(true);
      setError(null);

      try {
        // Check if domain is already taken
        const domainCheck = await queryAzure(
          'SELECT id FROM lessor_accounts WHERE custom_domain = $1',
          [input.customDomain]
        );

        if (domainCheck.rows.length > 0) {
          throw new Error('Dette domæne er allerede taget');
        }

        // Create lessor account
        const result = await queryAzure(
          `INSERT INTO lessor_accounts 
           (user_id, company_name, cvr_number, custom_domain, subscription_tier, branding, trial_ends_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, user_id, company_name, custom_domain, subscription_tier, created_at`,
          [
            input.userId,
            input.companyName,
            input.cvr || null,
            input.customDomain,
            'trial',
            JSON.stringify({
              logo_url: null,
              primary_color: input.primaryColor || '#0066cc',
              secondary_color: '#f0f0f0',
              company_name: input.companyName,
              favicon_url: null,
            }),
            new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
          ]
        );

        if (result.rows.length === 0) {
          throw new Error('Failed to create account');
        }

        const account = result.rows[0];

        // Create team member record (owner role)
        await queryAzure(
          `INSERT INTO lessor_team_members 
           (lessor_account_id, user_id, role, joined_at, active)
           VALUES ($1, $2, $3, $4, $5)`,
          [account.id, input.userId, 'owner', new Date().toISOString(), true]
        );

        // Create settings record
        await queryAzure(
          `INSERT INTO lessor_settings 
           (lessor_account_id, settings)
           VALUES ($1, $2)`,
          [
            account.id,
            JSON.stringify({
              email_notifications: true,
              sms_notifications: false,
              language: 'da',
              timezone: 'Europe/Copenhagen',
              currency: 'DKK',
            }),
          ]
        );

        return account;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createAccount, loading, error };
}

/**
 * Get lessor account by domain
 */
export function useLessorAccountByDomain() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAccount = useCallback(
    async (domain: string) => {
      setLoading(true);
      setError(null);

      try {
        const result = await queryAzure(
          `SELECT 
             id, user_id, company_name, custom_domain, subscription_tier, 
             branding, trial_ends_at, stripe_subscription_id, created_at
           FROM lessor_accounts 
           WHERE custom_domain = $1`,
          [domain]
        );

        return result.rows[0] || null;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { getAccount, loading, error };
}

/**
 * Get lessor account by user ID
 */
export function useLessorAccountByUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAccount = useCallback(
    async (userId: string) => {
      setLoading(true);
      setError(null);

      try {
        const result = await queryAzure(
          `SELECT 
             id, user_id, company_name, custom_domain, subscription_tier, 
             branding, trial_ends_at, stripe_subscription_id, created_at
           FROM lessor_accounts 
           WHERE user_id = $1
           LIMIT 1`,
          [userId]
        );

        return result.rows[0] || null;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { getAccount, loading, error };
}

/**
 * Update lessor account (branding, subscription tier, etc)
 */
export function useUpdateLessorAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateAccount = useCallback(
    async (accountId: string, updates: Partial<CreateLessorAccountInput>) => {
      setLoading(true);
      setError(null);

      try {
        const setClauses: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updates.companyName) {
          setClauses.push(`company_name = $${paramIndex++}`);
          values.push(updates.companyName);
        }

        if (updates.primaryColor) {
          setClauses.push(`branding = jsonb_set(branding, '{primary_color}', $${paramIndex++})`);
          values.push(`"${updates.primaryColor}"`);
        }

        if (setClauses.length === 0) {
          return;
        }

        setClauses.push(`updated_at = $${paramIndex++}`);
        values.push(new Date().toISOString());

        values.push(accountId);

        const query = `UPDATE lessor_accounts SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

        const result = await queryAzure(query, values);
        return result.rows[0] || null;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateAccount, loading, error };
}
