import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type WarningReason = 
  | 'damage'
  | 'non_payment'
  | 'contract_violation'
  | 'fraud'
  | 'reckless_driving'
  | 'late_return'
  | 'cleanliness'
  | 'other';

export type WarningStatus = 'active' | 'under_review' | 'dismissed' | 'expired';
export type AppealStatus = 'pending' | 'reviewing' | 'approved' | 'rejected';

export interface RenterWarning {
  id: string;
  renter_email: string;
  renter_phone: string | null;
  renter_license_number: string | null;
  renter_name: string | null;
  reported_by: string;
  booking_id: string | null;
  reason: WarningReason;
  description: string;
  severity: number;
  damage_amount: number;
  unpaid_amount: number;
  status: WarningStatus;
  expires_at: string;
  created_at: string;
}

export interface WarningAppeal {
  id: string;
  warning_id: string;
  appellant_email: string;
  appellant_name: string | null;
  appeal_reason: string;
  supporting_info: string | null;
  status: AppealStatus;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface CreateWarningInput {
  renter_email: string;
  renter_phone?: string;
  renter_license_number?: string;
  renter_name?: string;
  booking_id?: string;
  reason: WarningReason;
  description: string;
  severity?: number;
  damage_amount?: number;
  unpaid_amount?: number;
}

export const WARNING_REASON_LABELS: Record<WarningReason, string> = {
  damage: 'Skade på køretøj',
  non_payment: 'Manglende betaling',
  contract_violation: 'Kontraktbrud',
  fraud: 'Svindel',
  reckless_driving: 'Vanvidskørsel',
  late_return: 'Forsinket aflevering',
  cleanliness: 'Manglende rengøring',
  other: 'Anden årsag',
};

export const WARNING_STATUS_LABELS: Record<WarningStatus, string> = {
  active: 'Aktiv',
  under_review: 'Under behandling',
  dismissed: 'Afvist',
  expired: 'Udløbet',
};

export const APPEAL_STATUS_LABELS: Record<AppealStatus, string> = {
  pending: 'Afventer',
  reviewing: 'Under behandling',
  approved: 'Godkendt',
  rejected: 'Afvist',
};

export const useRenterWarnings = () => {
  const { user, profile } = useAuth();
  const [warnings, setWarnings] = useState<RenterWarning[]>([]);
  const [myReportedWarnings, setMyReportedWarnings] = useState<RenterWarning[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWarnings = async () => {
    if (!user) {
      setWarnings([]);
      setMyReportedWarnings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch all active warnings (for checking renters)
      const { data: activeWarnings, error: activeError } = await supabase
        .from('renter_warnings')
        .select('*')
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (activeError) throw activeError;
      setWarnings((activeWarnings || []) as RenterWarning[]);

      // Fetch my reported warnings
      const { data: myWarnings, error: myError } = await supabase
        .from('renter_warnings')
        .select('*')
        .eq('reported_by', user.id)
        .order('created_at', { ascending: false });

      if (myError) throw myError;
      setMyReportedWarnings((myWarnings || []) as RenterWarning[]);
    } catch (err) {
      console.error('Error fetching warnings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkRenter = async (
    email?: string,
    phone?: string,
    licenseNumber?: string
  ): Promise<RenterWarning[]> => {
    if (!email && !phone && !licenseNumber) return [];

    try {
      let query = supabase
        .from('renter_warnings')
        .select('*')
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString());

      // Build OR conditions
      const conditions: string[] = [];
      if (email) conditions.push(`renter_email.ilike.${email}`);
      if (phone) conditions.push(`renter_phone.eq.${phone}`);
      if (licenseNumber) conditions.push(`renter_license_number.ilike.${licenseNumber}`);

      // Use separate queries and merge results
      const results: RenterWarning[] = [];
      
      if (email) {
        const { data } = await supabase
          .from('renter_warnings')
          .select('*')
          .eq('status', 'active')
          .gt('expires_at', new Date().toISOString())
          .ilike('renter_email', email);
        if (data) results.push(...(data as RenterWarning[]));
      }
      
      if (phone) {
        const { data } = await supabase
          .from('renter_warnings')
          .select('*')
          .eq('status', 'active')
          .gt('expires_at', new Date().toISOString())
          .eq('renter_phone', phone);
        if (data) results.push(...(data as RenterWarning[]));
      }
      
      if (licenseNumber) {
        const { data } = await supabase
          .from('renter_warnings')
          .select('*')
          .eq('status', 'active')
          .gt('expires_at', new Date().toISOString())
          .ilike('renter_license_number', licenseNumber);
        if (data) results.push(...(data as RenterWarning[]));
      }

      // Deduplicate by id
      const unique = results.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
      return unique;
    } catch (err) {
      console.error('Error checking renter:', err);
      return [];
    }
  };

  const createWarning = async (input: CreateWarningInput): Promise<RenterWarning | null> => {
    if (!user) {
      toast.error('Du skal være logget ind');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('renter_warnings')
        .insert({
          ...input,
          reported_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Send notification email
      try {
        const lessorName = profile?.company_name || profile?.full_name || 'En udlejer';
        const appealUrl = `${window.location.origin}/appeal/${data.id}`;
        
        await supabase.functions.invoke('send-warning-notification', {
          body: {
            renterEmail: input.renter_email,
            renterName: input.renter_name || 'Lejer',
            warningId: data.id,
            reason: input.reason,
            lessorName,
            appealUrl,
          },
        });
      } catch (emailErr) {
        console.error('Error sending notification email:', emailErr);
        // Don't fail the whole operation if email fails
      }

      toast.success('Advarsel oprettet og lejer er notificeret');
      await fetchWarnings();
      return data as RenterWarning;
    } catch (err) {
      console.error('Error creating warning:', err);
      toast.error('Kunne ikke oprette advarsel');
      return null;
    }
  };

  useEffect(() => {
    fetchWarnings();
  }, [user]);

  return {
    warnings,
    myReportedWarnings,
    isLoading,
    createWarning,
    checkRenter,
    refetch: fetchWarnings,
  };
};
