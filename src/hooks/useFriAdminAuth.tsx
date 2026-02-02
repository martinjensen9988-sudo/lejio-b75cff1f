import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/azure/client';

export interface FriAdminProfile {
  id: string;
  email: string;
  admin_name: string;
  admin_email: string;
  is_super_admin: boolean;
  created_at: string;
}

interface FriAdminContextType {
  admin: FriAdminProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const FriAdminContext = createContext<FriAdminContextType | undefined>(undefined);

export const FriAdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<FriAdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Verify this is an admin user
          const { data: adminData, error: adminError } = await supabase
            .from('fri_admins')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!adminError && adminData) {
            setAdmin(adminData);
          } else {
            // User is authenticated but not an admin
            await supabase.auth.signOut();
            setAdmin(null);
          }
        }
      } catch (err) {
        console.error('Error checking admin session:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAdminSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: adminData } = await supabase
          .from('fri_admins')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (adminData) {
          setAdmin(adminData);
        } else {
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw new Error(authError.message);

      // Verify user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('fri_admins')
        .select('*')
        .eq('id', authData.user!.id)
        .single();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        throw new Error('User is not an admin');
      }

      setAdmin(adminData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setAdmin(null);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: FriAdminContextType = {
    admin,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!admin,
  };

  return (
    <FriAdminContext.Provider value={value}>
      {children}
    </FriAdminContext.Provider>
  );
};

export const useFriAdminAuth = () => {
  const context = useContext(FriAdminContext);
  if (context === undefined) {
    throw new Error('useFriAdminAuth must be used within FriAdminAuthProvider');
  }
  return context;
};
