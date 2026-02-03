import { useEffect, useState, useCallback } from 'react';

interface FriAuthUser {
  id: string;
  email: string;
  company_name?: string;
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
 * Uses Azure Functions for auth endpoints
 */
export function useFriAuth(): UseFriAuthReturn {
  const [user, setUser] = useState<FriAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:7071/api';

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

        const response = await fetch(`${apiBaseUrl}/auth/me`, {
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
  }, [apiBaseUrl]);

  const signUp = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiBaseUrl}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Signup failed');
        }

        const userData = await response.json();
        // For signup, user needs email confirmation, so we don't auto-login
        setUser(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiBaseUrl]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${apiBaseUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Login failed');
        }

        const data = await response.json();
        
        // Store session token
        if (data.session?.access_token) {
          localStorage.setItem('fri-auth-token', data.session.access_token);
        }
        
        setUser(data.session?.user || {
          id: '',
          email: email,
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [apiBaseUrl]
  );

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('fri-auth-token');
      if (token) {
        await fetch(`${apiBaseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
      localStorage.removeItem('fri-auth-token');
      setUser(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    error,
  };
}
