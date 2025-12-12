import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface DamageItem {
  id: string;
  damage_report_id: string;
  position: string;
  damage_type: string;
  severity: 'minor' | 'moderate' | 'severe';
  description: string | null;
  photo_url: string | null;
  created_at: string;
}

export interface DamageReport {
  id: string;
  booking_id: string;
  contract_id: string | null;
  vehicle_id: string;
  report_type: 'pickup' | 'return';
  odometer_reading: number | null;
  fuel_level: 'empty' | 'quarter' | 'half' | 'three_quarters' | 'full' | null;
  exterior_clean: boolean;
  interior_clean: boolean;
  notes: string | null;
  reported_by: string;
  created_at: string;
  updated_at: string;
  damage_items?: DamageItem[];
}

export interface CreateDamageReportInput {
  booking_id: string;
  contract_id?: string;
  vehicle_id: string;
  report_type: 'pickup' | 'return';
  odometer_reading?: number;
  fuel_level?: 'empty' | 'quarter' | 'half' | 'three_quarters' | 'full';
  exterior_clean?: boolean;
  interior_clean?: boolean;
  notes?: string;
}

export interface CreateDamageItemInput {
  damage_report_id: string;
  position: string;
  damage_type: string;
  severity: 'minor' | 'moderate' | 'severe';
  description?: string;
  photo_url?: string;
}

export const useDamageReports = (bookingId?: string) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<DamageReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    if (!user || !bookingId) {
      setReports([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data: reportsData, error: reportsError } = await supabase
        .from('damage_reports')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (reportsError) throw reportsError;

      // Fetch damage items for each report
      const reportsWithItems = await Promise.all(
        (reportsData || []).map(async (report) => {
          const { data: itemsData } = await supabase
            .from('damage_items')
            .select('*')
            .eq('damage_report_id', report.id)
            .order('created_at', { ascending: true });

          return {
            ...report,
            report_type: report.report_type as 'pickup' | 'return',
            fuel_level: report.fuel_level as DamageReport['fuel_level'],
            damage_items: (itemsData || []).map(item => ({
              ...item,
              severity: item.severity as DamageItem['severity'],
            })),
          };
        })
      );

      setReports(reportsWithItems);
    } catch (err) {
      console.error('Error fetching damage reports:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createReport = async (input: CreateDamageReportInput): Promise<DamageReport | null> => {
    if (!user) {
      toast.error('Du skal være logget ind');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('damage_reports')
        .insert({
          ...input,
          reported_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success(`Skadesrapport for ${input.report_type === 'pickup' ? 'udlevering' : 'indlevering'} oprettet`);
      await fetchReports();
      
      return {
        ...data,
        report_type: data.report_type as 'pickup' | 'return',
        fuel_level: data.fuel_level as DamageReport['fuel_level'],
      };
    } catch (err) {
      console.error('Error creating damage report:', err);
      toast.error('Kunne ikke oprette skadesrapport');
      return null;
    }
  };

  const updateReport = async (reportId: string, updates: Partial<CreateDamageReportInput>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('damage_reports')
        .update(updates)
        .eq('id', reportId);

      if (error) throw error;

      toast.success('Skadesrapport opdateret');
      await fetchReports();
      return true;
    } catch (err) {
      console.error('Error updating damage report:', err);
      toast.error('Kunne ikke opdatere skadesrapport');
      return false;
    }
  };

  const addDamageItem = async (input: CreateDamageItemInput): Promise<DamageItem | null> => {
    try {
      const { data, error } = await supabase
        .from('damage_items')
        .insert(input)
        .select()
        .single();

      if (error) throw error;

      toast.success('Skade tilføjet');
      await fetchReports();
      
      return {
        ...data,
        severity: data.severity as DamageItem['severity'],
      };
    } catch (err) {
      console.error('Error adding damage item:', err);
      toast.error('Kunne ikke tilføje skade');
      return null;
    }
  };

  const removeDamageItem = async (itemId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('damage_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast.success('Skade fjernet');
      await fetchReports();
      return true;
    } catch (err) {
      console.error('Error removing damage item:', err);
      toast.error('Kunne ikke fjerne skade');
      return false;
    }
  };

  const uploadDamagePhoto = async (file: File, reportId: string): Promise<string | null> => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${reportId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('damage-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('damage-photos')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading photo:', err);
      toast.error('Kunne ikke uploade billede');
      return null;
    }
  };

  const getReportByType = (type: 'pickup' | 'return') => {
    return reports.find(r => r.report_type === type);
  };

  useEffect(() => {
    fetchReports();
  }, [user, bookingId]);

  return {
    reports,
    isLoading,
    createReport,
    updateReport,
    addDamageItem,
    removeDamageItem,
    uploadDamagePhoto,
    getReportByType,
    refetch: fetchReports,
  };
};
