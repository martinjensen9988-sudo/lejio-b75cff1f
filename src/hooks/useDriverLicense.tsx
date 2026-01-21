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
      // Upload images in parallel for speed
      const [frontUrl, backUrl] = await Promise.all([
        uploadImage(frontImage, 'front'),
        backImage ? uploadImage(backImage, 'back') : Promise.resolve(null),
      ]);

      if (!frontUrl) throw new Error('Kunne ikke uploade forside');

      // Create license record with "processing" status
      const { data: newLicense, error } = await supabase
        .from('driver_licenses')
        .insert({
          user_id: user.id,
          license_number: licenseNumber,
          license_country: licenseCountry,
          front_image_url: frontUrl,
          back_image_url: backUrl,
          verification_status: 'processing',
        })
        .select()
        .single();

      if (error) throw error;

      // Set license immediately so UI updates
      setLicense(newLicense);
      toast.success('Kørekort indsendt - verificering i gang');

      // Trigger AI verification in background (non-blocking)
      supabase.functions.invoke('verify-driver-license', {
        body: {
          licenseId: newLicense.id,
          frontImageUrl: frontUrl,
          backImageUrl: backUrl,
        }
      }).then(() => {
        console.log('Verification triggered');
      }).catch((err) => {
        console.error('Verification trigger error:', err);
      });

      // Poll for status updates
      const pollForUpdate = async (attempts = 0) => {
        if (attempts >= 12) return; // Max 1 minute polling
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const { data: updated } = await supabase
          .from('driver_licenses')
          .select('*')
          .eq('id', newLicense.id)
          .single();
        
        if (updated && updated.verification_status !== 'processing') {
          setLicense(updated);
          
          if (updated.verification_status === 'verified') {
            toast.success('Kørekort verificeret!');
          } else if (updated.verification_status === 'pending_admin_review') {
            toast.info('Kørekort sendt til manuel gennemgang');
          } else if (updated.verification_status === 'rejected') {
            toast.error('Kørekort kunne ikke verificeres');
          }
        } else if (updated?.verification_status === 'processing') {
          pollForUpdate(attempts + 1);
        }
      };
      
      pollForUpdate();
      
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
  const isProcessing = license?.verification_status === 'processing';
  const isPending = license?.verification_status === 'pending' || 
                    license?.verification_status === 'pending_review' || 
                    license?.verification_status === 'pending_admin_review' ||
                    isProcessing;
  const isRejected = license?.verification_status === 'rejected';
  const isPendingAdminReview = license?.verification_status === 'pending_admin_review';

  // Allow booking to proceed if license exists (optimistic - don't block on verification)
  const canProceedWithBooking = !!license && !isRejected;

  return {
    license,
    isLoading,
    isUploading,
    submitLicense,
    isVerified,
    isProcessing,
    isPending,
    isRejected,
    isPendingAdminReview,
    canProceedWithBooking,
    refetch: fetchLicense,
  };
};
