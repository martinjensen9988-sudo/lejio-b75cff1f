import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CVRData {
  cvr: string;
  companyName: string;
  address?: string;
  city?: string;
  postalCode?: string;
  status?: string;
}

interface UseCVRLookupReturn {
  data: CVRData | null;
  isLoading: boolean;
  error: string | null;
  lookupCVR: (cvr: string) => Promise<CVRData | null>;
  reset: () => void;
}

export const useCVRLookup = (): UseCVRLookupReturn => {
  const [data, setData] = useState<CVRData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupCVR = useCallback(async (cvr: string): Promise<CVRData | null> => {
    const cleanCvr = cvr.replace(/\D/g, '');
    
    if (cleanCvr.length !== 8) {
      setError('CVR-nummer skal være 8 cifre');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data: responseData, error: invokeError } = await supabase.functions.invoke('cvr-lookup', {
        body: { cvr: cleanCvr },
      });

      if (invokeError) {
        console.error('CVR lookup invoke error:', invokeError);
        setError('Kunne ikke slå CVR op');
        setData(null);
        return null;
      }

      if (responseData?.error) {
        setError(responseData.error);
        setData(null);
        return null;
      }

      setData(responseData as CVRData);
      return responseData as CVRData;
    } catch (err) {
      console.error('CVR lookup error:', err);
      setError('Der opstod en fejl ved CVR-opslag');
      setData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, isLoading, error, lookupCVR, reset };
};
