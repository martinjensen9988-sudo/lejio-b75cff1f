import { createContext, useContext, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { useFriAuth } from '@/hooks/useFriAuth';

interface FriAuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: Error | null;
}

const FriAuthContext = createContext<FriAuthContextType | undefined>(undefined);

export function FriAuthProvider({ children }: { children: ReactNode }) {
  const auth = useFriAuth();

  return <FriAuthContext.Provider value={auth}>{children}</FriAuthContext.Provider>;
}

export function useFriAuthContext(): FriAuthContextType {
  const context = useContext(FriAuthContext);
  if (!context) {
    throw new Error('useFriAuthContext must be used within FriAuthProvider');
  }
  return context;
}
