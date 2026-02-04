import { useEffect, useState, useCallback } from 'react';

interface FriAuthUser {
  lessorId: string;
  email: string;
  companyName: string;
  primaryColor: string;
}

interface UseFriAuthReturn {
  user: FriAuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: Error | null;
  token: string | null;
}

/**
 * Hook for Lejio Fri authentication
 * Uses Azure Functions backend with JWT tokens
 */
export function useFriAuth(): UseFriAuthReturn {
  const [user, setUser] = useState<FriAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Check auth on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('fri-auth-token');
    if (storedToken) {
      try {
        // Decode token to get user info
        const parts = storedToken.split('.');
        if (parts.length === 3) {
          const decoded = JSON.parse(atob(parts[1]));
          setUser({
            lessorId: decoded.sub,
            email: decoded.email,
            companyName: decoded.company_name,
            primaryColor: decoded.primary_color
          });
          setToken(storedToken);
        }
      } catch (err) {
        console.error('Token decode error:', err);
        localStorage.removeItem('fri-auth-token');
      }
    }
    setLoading(false);
  }, []);

  const signUp = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.REACT_APP_API_BASE_URL || '/api';
        const response = await fetch(`${apiUrl}/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Signup failed');
        }

        // Don't auto-login after signup, user needs to verify email
        setUser(null);
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

  const signOut = useCallback(async () => {
    localStorage.removeItem('fri-auth-token');
    setUser(null);
    setToken(null);
  }, []);

  return {
    user,
    loading,
    signIn,
    signOut,
    error,
    token
  };
}
