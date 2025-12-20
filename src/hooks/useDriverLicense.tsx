import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface DriverLicense {
  id: string;
  user_id: string;
  license_number: string;
  license_country: string;
  issue_date: string | null;
  expiry_date: string | null;
  front_image_url: string | null;
  back_image_url: string | null;
  verification_status: string;
  ai_verification_result: any;
  verified_at: string | null;
  rejection_reason: string | null;
}

export const useDriverLicense = () => {
  const { user } = useAuth();
  const [license, setLicense] = useState<DriverLicense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchLicense = useCallback(async () => {
    if (!user) {
      setLicense(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('driver_licenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setLicense(data || null);
    } catch (error) {
      console.error('Error fetching driver license:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchLicense();
  }, [fetchLicense]);

  const uploadImage = async (file: File, side: 'front' | 'back'): Promise<string | null> => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${side}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('driver-licenses')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('driver-licenses')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const submitLicense = async (
    frontImage: File,
    backImage: File | null,
    licenseNumber: string,
    licenseCountry: string = 'Danmark'
  ) => {
    if (!user) {
      toast.error('Du skal være logget ind');
      return null;
    }

    setIsUploading(true);

    try {
      // Upload images
      const frontUrl = await uploadImage(frontImage, 'front');
      if (!frontUrl) throw new Error('Kunne ikke uploade forside');

      let backUrl = null;
      if (backImage) {
        backUrl = await uploadImage(backImage, 'back');
      }

      // Create license record
      const { data: newLicense, error } = await supabase
        .from('driver_licenses')
        .insert({
          user_id: user.id,
          license_number: licenseNumber,
          license_country: licenseCountry,
          front_image_url: frontUrl,
          back_image_url: backUrl,
          verification_status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger AI verification
      await supabase.functions.invoke('verify-driver-license', {
        body: {
          licenseId: newLicense.id,
          frontImageUrl: frontUrl,
          backImageUrl: backUrl,
        }
      });

      setLicense(newLicense);
      toast.success('Kørekort indsendt til verificering');
      
      // Refetch to get updated status
      setTimeout(fetchLicense, 5000);
      
      return newLicense;
    } catch (error: any) {
      console.error('Error submitting license:', error);
      toast.error(error.message || 'Kunne ikke indsende kørekort');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const isVerified = license?.verification_status === 'verified';
  const isPending = license?.verification_status === 'pending' || license?.verification_status === 'pending_review';
  const isRejected = license?.verification_status === 'rejected';

  return {
    license,
    isLoading,
    isUploading,
    submitLicense,
    isVerified,
    isPending,
    isRejected,
    refetch: fetchLicense,
  };
};
