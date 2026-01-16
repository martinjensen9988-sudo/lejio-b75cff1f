import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

type AdminRole = 'support' | 'admin' | 'super_admin' | null;

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [adminRole, setAdminRole] = useState<AdminRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isInitializedRef = useRef(false);

  const checkAdminStatus = useCallback(async (userId: string): Promise<AdminRole> => {
    try {
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
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      if (isInitializedRef.current) return;
      
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
        if (mounted) {
          setUser(null);
          setAdminRole(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
          isInitializedRef.current = true;
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        // Handle sign out event immediately
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setAdminRole(null);
          setIsLoading(false);
          return;
        }
        
        if (session?.user) {
          setUser(session.user);
          // Check admin status after initialization
          if (isInitializedRef.current) {
            const role = await checkAdminStatus(session.user.id);
            if (mounted) {
              setAdminRole(role);
              setIsLoading(false);
            }
          }
        } else {
          setUser(null);
          setAdminRole(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      return { error };
    }

    if (data.user) {
      const { data: hasAnyRole } = await (supabase.rpc as any)('has_any_admin_role', {
        _user_id: data.user.id
      });

      if (!hasAnyRole) {
        await supabase.auth.signOut();
        setIsLoading(false);
        return { error: { message: 'Du har ikke adgang til admin-panelet' } };
      }
      
      setUser(data.user);
      const role = await checkAdminStatus(data.user.id);
      setAdminRole(role);
    }

    setIsLoading(false);
    return { error: null };
  };

  const signOut = useCallback(async () => {
    // Clear state immediately
    setUser(null);
    setAdminRole(null);
    
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

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
