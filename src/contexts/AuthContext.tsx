
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Simplified AuthUser type for anonymous auth only
export interface AuthUser extends User {
  displayName: string;
  country: string;
  language: 'en' | 'rw';
  createdAt: string;
  lastLogin: string;
  avatar?: string;
  mobileMoneyNumber?: string;
  whatsappNumber?: string;
  // Make Supabase properties required for compatibility
  app_metadata: any;
  user_metadata: any;
  aud: string;
  created_at: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<AuthUser>) => void;
  ensureAnonymousAuth: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch additional user data from users table
  const fetchUserData = async (supabaseUser: User): Promise<AuthUser> => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('display_name, mobile_money_number, whatsapp_number, country')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.log('No user data found in users table, using defaults');
      }

      return {
        ...supabaseUser,
        displayName: userData?.display_name || supabaseUser.email || 'Anonymous User',
        country: userData?.country || 'RW',
        language: 'en' as 'en' | 'rw',
        createdAt: supabaseUser.created_at,
        lastLogin: supabaseUser.last_sign_in_at || supabaseUser.created_at,
        mobileMoneyNumber: userData?.mobile_money_number,
        whatsappNumber: userData?.whatsapp_number,
        app_metadata: supabaseUser.app_metadata || { provider: 'anonymous' },
        user_metadata: supabaseUser.user_metadata || {},
        aud: supabaseUser.aud || 'authenticated',
        created_at: supabaseUser.created_at
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return convertToAuthUser(supabaseUser);
    }
  };

  // Convert Supabase User to AuthUser
  const convertToAuthUser = (supabaseUser: User): AuthUser => {
    return {
      ...supabaseUser,
      displayName: supabaseUser.email || 'Anonymous User',
      country: 'RW',
      language: 'en' as 'en' | 'rw',
      createdAt: supabaseUser.created_at,
      lastLogin: supabaseUser.last_sign_in_at || supabaseUser.created_at,
      app_metadata: supabaseUser.app_metadata || { provider: 'anonymous' },
      user_metadata: supabaseUser.user_metadata || {},
      aud: supabaseUser.aud || 'authenticated',
      created_at: supabaseUser.created_at
    };
  };

  // Refresh user data from database
  const refreshUserData = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession?.user) {
        const updatedUser = await fetchUserData(currentSession.user);
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Ensure anonymous authentication - FIXED to prevent duplicates
  const ensureAnonymousAuth = async () => {
    try {
      // First check if we already have a valid session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession?.user) {
        console.log('Using existing session:', currentSession.user.id);
        return; // Don't create a new one if we already have one
      }

      // Only create new anonymous session if we don't have one
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error('Failed to create anonymous session:', error);
      } else {
        console.log('New anonymous session created:', data.session?.user?.id);
      }
    } catch (error) {
      console.error('Anonymous auth error:', error);
    }
  };

  useEffect(() => {
    let initialized = false;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Defer user data fetching to prevent auth state change deadlocks
          setTimeout(async () => {
            try {
              const authUser = await fetchUserData(session.user);
              setUser(authUser);
            } catch (error) {
              console.error('Error setting user data:', error);
              setUser(convertToAuthUser(session.user));
            }
          }, 0);
        } else {
          setUser(null);
          // Only try to create anonymous auth if we haven't initialized yet
          if (!initialized) {
            setTimeout(() => {
              ensureAnonymousAuth();
            }, 0);
          }
        }
        setLoading(false);
        initialized = true;
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSession(session);
          const authUser = await fetchUserData(session.user);
          setUser(authUser);
        } else if (!initialized) {
          await ensureAnonymousAuth();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      }
      setLoading(false);
      initialized = true;
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
    // After sign out, create new anonymous session
    setTimeout(() => {
      ensureAnonymousAuth();
    }, 100);
  };

  const logout = async () => {
    await signOut();
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const isLoggedIn = !!session || !!user;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        loading,
        isLoading: loading,
        isLoggedIn,
        signOut,
        logout,
        updateUser,
        ensureAnonymousAuth,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Add backward compatibility alias
export const useAuth = useAuthContext;
