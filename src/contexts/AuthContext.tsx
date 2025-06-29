
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { UserRole } from '@/types/database';

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  // Additional auth functions (stubs for compatibility)
  ensureAnonymousAuth?: () => Promise<any>;
  signInEmail?: (email: string, password: string) => Promise<any>;
  signInWhatsApp?: (phone: string) => Promise<any>;
  signInAnonymous?: () => Promise<any>;
  signInGoogle?: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      // Ensure role is one of the valid types
      const validRoles: UserRole[] = ['user', 'admin', 'owner'];
      const role = data?.role as string;
      setUserRole(validRoles.includes(role as UserRole) ? (role as UserRole) : 'user');
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('user'); // Default to user role
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Stub implementations for compatibility
  const ensureAnonymousAuth = async () => {
    console.log('ensureAnonymousAuth stub called');
    if (!user) {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      return data;
    }
    return { user };
  };

  const signInEmail = async (email: string, password: string) => {
    console.log('signInEmail stub called');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  };

  const signInWhatsApp = async (phone: string) => {
    console.log('signInWhatsApp stub called');
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
      options: { channel: 'sms' }
    });
    if (error) throw error;
    return data;
  };

  const signInAnonymous = async () => {
    console.log('signInAnonymous stub called');
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    return data;
  };

  const signInGoogle = async () => {
    console.log('signInGoogle stub called');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    });
    if (error) throw error;
    return data;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userRole, 
      loading, 
      signOut,
      ensureAnonymousAuth,
      signInEmail,
      signInWhatsApp,
      signInAnonymous,
      signInGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Alias for compatibility
export const useAuthContext = useAuth;
