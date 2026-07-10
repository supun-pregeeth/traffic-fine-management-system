import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginAdmin } from '../api/authApi';
import { setAuthToken } from '../api/client';

interface User {
  username: string;
  role: 'Super Admin';
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = 'police-admin-auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as User;
    setAuthToken(parsed.token);
    return parsed;
  });

  useEffect(() => {
    if (user) {
      setAuthToken(user.token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      setAuthToken(undefined);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (username: string, password: string) => {
    try {
      const response = await loginAdmin(username, password);
      const payload = response.data?.data;
      if (!payload?.token) {
        return false;
      }

      const account: User = {
        username: payload.email,
        role: 'Super Admin',
        token: payload.token,
      };
      setUser(account);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
