import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

type AdminRole = 'support' | 'admin' | 'super_admin' | null;

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [adminRole, setAdminRole] = useState<AdminRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAdminStatus = async (userId: string): Promise<AdminRole> => {
      try {
        // Check roles in order of privilege (highest first)
        const roles: ('super_admin' | 'admin' | 'support')[] = ['super_admin', 'admin', 'support'];
        
        for (const role of roles) {
          const { data, error } = await supabase.rpc('has_role', {
            _user_id: userId,
            _role: role
          });
          
          if (error) {
            console.error(`Error checking ${role} status:`, error);
            continue;
          }
          
          if (data === true) {
            return role;
          }
        }
        return null;
      } catch (err) {
        console.error('Error in checkAdminStatus:', err);
        return null;
      }
    };

    // Initial session check
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (session?.user) {
          setUser(session.user);
          const role = await checkAdminStatus(session.user.id);
          if (mounted) {
            setAdminRole(role);
          }
        } else {
          setUser(null);
          setAdminRole(null);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const role = await checkAdminStatus(session.user.id);
          if (mounted) {
            setAdminRole(role);
          }
        } else {
          setAdminRole(null);
        }
        
        // Always set loading to false after processing any auth state change
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error };

    // Check if user has any admin role
    if (data.user) {
      const { data: hasAnyRole } = await supabase.rpc('has_any_admin_role', {
        _user_id: data.user.id
      });

      if (!hasAnyRole) {
        await supabase.auth.signOut();
        return { error: { message: 'Du har ikke adgang til admin-panelet' } };
      }
    }

    return { error: null };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setUser(null);
      setAdminRole(null);
    }
  };

  // Computed properties for backwards compatibility
  const isSuperAdmin = adminRole === 'super_admin';
  const isAdmin = adminRole === 'admin' || adminRole === 'super_admin';
  const isSupport = adminRole === 'support' || isAdmin;
  const hasAccess = adminRole !== null;

  return {
    user,
    adminRole,
    isSuperAdmin,
    isAdmin,
    isSupport,
    hasAccess,
    isLoading,
    signIn,
    signOut,
  };
};
