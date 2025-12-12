import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async (userId: string) => {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'super_admin'
      });
      
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      return data === true;
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const isAdmin = await checkAdminStatus(session.user.id);
          setIsSuperAdmin(isAdmin);
        } else {
          setIsSuperAdmin(false);
        }
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const isAdmin = await checkAdminStatus(session.user.id);
        setIsSuperAdmin(isAdmin);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
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
