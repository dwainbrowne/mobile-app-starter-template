import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

import { defaultUser } from '@/config';
import type { UserInfo } from '@/interfaces';

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  signIn: (user: UserInfo) => void;
  signOut: () => void;
  updateUser: (user: Partial<UserInfo>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize with default user from config (guest mode)
  const [user, setUser] = useState<UserInfo | null>(defaultUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = useCallback((userData: UserInfo) => {
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(() => {
    setUser(defaultUser);
    setIsAuthenticated(false);
    // TODO: Clear any stored tokens, navigate to login, etc.
  }, []);

  const updateUser = useCallback((updates: Partial<UserInfo>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
