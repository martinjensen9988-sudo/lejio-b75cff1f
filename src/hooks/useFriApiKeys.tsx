import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const generateApiKey = () => {
  // Generate a random alphanumeric string
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export interface ApiKey {
  id: string;
  lessor_id: string;
  name: string;
  key: string; // Masked key like "sk_live_...****"
  full_key?: string; // Only returned on creation
  status: 'active' | 'inactive';
  last_used_at?: string;
  created_at: string;
  expires_at?: string;
}

interface UseFriApiKeysReturn {
  apiKeys: ApiKey[];
  loading: boolean;
  error: string | null;
  fetchApiKeys: (lessorId: string) => Promise<void>;
  createApiKey: (lessorId: string, name: string) => Promise<ApiKey | null>;
  deleteApiKey: (keyId: string) => Promise<void>;
  revokeApiKey: (keyId: string) => Promise<void>;
  activateApiKey: (keyId: string) => Promise<void>;
}

export const useFriApiKeys = (): UseFriApiKeysReturn => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApiKeys = async (lessorId: string) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error: err } = await supabase
        .from('fri_api_keys')
        .select('*')
        .eq('lessor_id', lessorId)
        .order('created_at', { ascending: false });

      if (err) throw new Error(err.message);
      
      // Mask the full keys
      const maskedKeys = (data || []).map(k => ({
        ...k,
        key: `sk_live_${k.key.substring(0, 8)}****`,
      }));

      setApiKeys(maskedKeys);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fejl ved indlæsning af API keys';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async (lessorId: string, name: string): Promise<ApiKey | null> => {
    try {
      setError(null);

      // Generate a unique API key
      const fullKey = `sk_live_${generateApiKey()}`;
      const shortKey = generateApiKey();

      const { data, error: err } = await supabase
        .from('fri_api_keys')
        .insert({
          lessor_id: lessorId,
          name,
          key: shortKey,
          status: 'active',
        })
        .select()
        .single();

      if (err) throw new Error(err.message);

      // Return the full key only on creation
      return {
        ...data,
        full_key: fullKey,
        key: `sk_live_${shortKey.substring(0, 8)}****`,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fejl ved oprettelse af API key';
      setError(message);
      throw err;
    }
  };

  const deleteApiKey = async (keyId: string) => {
    try {
      const { error: err } = await supabase
        .from('fri_api_keys')
        .delete()
        .eq('id', keyId);

      if (err) throw new Error(err.message);

      setApiKeys(apiKeys.filter(k => k.id !== keyId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fejl ved sletning';
      setError(message);
      throw err;
    }
  };

  const revokeApiKey = async (keyId: string) => {
    try {
      const { error: err } = await supabase
        .from('fri_api_keys')
        .update({ status: 'inactive' })
        .eq('id', keyId);

      if (err) throw new Error(err.message);

      setApiKeys(apiKeys.map(k =>
        k.id === keyId ? { ...k, status: 'inactive' } : k
      ));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fejl ved tilbagekald';
      setError(message);
      throw err;
    }
  };

  const activateApiKey = async (keyId: string) => {
    try {
      const { error: err } = await supabase
        .from('fri_api_keys')
        .update({ status: 'active' })
        .eq('id', keyId);

      if (err) throw new Error(err.message);

      setApiKeys(apiKeys.map(k =>
        k.id === keyId ? { ...k, status: 'active' } : k
      ));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fejl ved aktivering';
      setError(message);
      throw err;
    }
  };

  return {
    apiKeys,
    loading,
    error,
    fetchApiKeys,
    createApiKey,
    deleteApiKey,
    revokeApiKey,
    activateApiKey,
  };
};
