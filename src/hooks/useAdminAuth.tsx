import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAdminStatus = async (userId: string) => {
      try {
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: userId,
          _role: 'super_admin'
        });
        
        if (error) {
          console.error('Error checking admin status:', error);
          return false;
        }
        return data === true;
      } catch (err) {
        console.error('Error in checkAdminStatus:', err);
        return false;
      }
    };

    // Initial session check
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (session?.user) {
          setUser(session.user);
          const isAdmin = await checkAdminStatus(session.user.id);
          if (mounted) {
            setIsSuperAdmin(isAdmin);
          }
        } else {
          setUser(null);
          setIsSuperAdmin(false);
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
          const isAdmin = await checkAdminStatus(session.user.id);
          if (mounted) {
            setIsSuperAdmin(isAdmin);
          }
        } else {
          setIsSuperAdmin(false);
        }
        
        // Only set loading false here if we're responding to a real auth change event
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
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

    // Check if user is super admin
    if (data.user) {
      const { data: isAdmin } = await supabase.rpc('has_role', {
        _user_id: data.user.id,
        _role: 'super_admin'
      });

      if (!isAdmin) {
        await supabase.auth.signOut();
        return { error: { message: 'Du har ikke adgang til admin-panelet' } };
      }
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsSuperAdmin(false);
  };

  return {
    user,
    isSuperAdmin,
    isLoading,
    signIn,
    signOut,
  };
};
