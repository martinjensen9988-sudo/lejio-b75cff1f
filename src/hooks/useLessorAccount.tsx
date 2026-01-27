import { supabase } from '@/integrations/supabase/client';

export interface CreateLessorAccountInput {
  user_id: string;
  company_name: string;
  custom_domain: string;
  cvr_number?: string;
  primary_color?: string;
}

/**
 * Create a new lessor account
 * Call after user signs up
 * This will be stored in Azure when connected
 * For now, we'll store metadata in Supabase
 */
export async function createLessorAccount(input: CreateLessorAccountInput) {
  try {
    // For now, store lessor metadata in a Supabase table
    // When Azure is connected, this will be moved to Azure
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: input.user_id,
        full_name: input.company_name,
        metadata: {
          lessor_account: true,
          company_name: input.company_name,
          custom_domain: input.custom_domain,
          cvr_number: input.cvr_number,
          branding: {
            primary_color: input.primary_color || '#0066cc',
            secondary_color: '#f0f0f0',
            company_name: input.company_name,
          },
          subscription_tier: 'trial',
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating lessor account:', error);
    throw error;
  }
}

/**
 * Get lessor account for current user
 */
export async function getLessorAccount(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching lessor account:', error);
    return null;
  }
}

/**
 * Update lessor account metadata
 */
export async function updateLessorAccount(
  userId: string,
  updates: Partial<CreateLessorAccountInput>
) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        metadata: updates,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating lessor account:', error);
    throw error;
  }
}
