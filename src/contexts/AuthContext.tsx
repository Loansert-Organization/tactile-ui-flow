
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '@/services/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser, tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem('auth_user');
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: AuthUser, tokens: { accessToken: string; refreshToken: string }) => {
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('auth_token', tokens.accessToken);
    localStorage.setItem('auth_refresh_token', tokens.refreshToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh_token');
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
