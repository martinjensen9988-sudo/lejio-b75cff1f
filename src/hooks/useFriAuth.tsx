import { useEffect, useState, useCallback } from 'react';

interface FriAuthUser {
  id: string;
  email: string;
  isLessor?: boolean;
}

interface UseFriAuthReturn {
  user: FriAuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: Error | null;
}

/**
 * Hook for Lejio Fri authentication
 * Uses Supabase edge functions for auth
 */
export function useFriAuth(): UseFriAuthReturn {
  const [user, setUser] = useState<FriAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://aqzggwewjttbkaqnbmrb.supabase.co';

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('fri-auth-token');
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const response = await fetch(`${supabaseUrl}/functions/v1/fri-auth-me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
          localStorage.removeItem('fri-auth-token');
        }
        setLoading(false);
      } catch (err) {
        console.error('Auth check error:', err);
        setUser(null);
        setLoading(false);
      }
    };

    checkAuth();
  }, [supabaseUrl]);

  const signUp = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/fri-auth-signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Signup failed');
        }

        const userData = await response.json();
        // For signup, user needs to verify email, so we don't auto-login
        setUser(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [supabaseUrl]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/fri-auth-signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Login failed');
        }

        const data = await response.json();
        
        // Store session token
        if (data.session?.access_token) {
          localStorage.setItem('fri-auth-token', data.session.access_token);
        }
        
        setUser({
          id: data.id,
          email: data.email,
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [supabaseUrl]
  );

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await fetch(`${supabaseUrl}/functions/v1/fri-auth-signout`, {
        method: 'POST',
      });
      localStorage.removeItem('fri-auth-token');
      setUser(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [supabaseUrl]);

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    error,
  };
}
