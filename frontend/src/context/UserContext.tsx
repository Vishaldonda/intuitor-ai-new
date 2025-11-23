/**
 * User context for global user state management.
 * Provides user profile, authentication status, and user actions.
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, progressAPI } from '../services/api';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  level: number;
  xp: number;
  streak: number;
}

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateXP: (xpToAdd: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('access_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    await authAPI.login(email, password);
    await loadUser();
  };

  const register = async (email: string, password: string, fullName: string) => {
    await authAPI.register(email, password, fullName);
    await loadUser();
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    await loadUser();
  };

  const updateXP = (xpToAdd: number) => {
    if (user) {
      setUser({
        ...user,
        xp: user.xp + xpToAdd,
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateXP,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
