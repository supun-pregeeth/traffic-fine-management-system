import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface User {
  username: string;
  role: 'Super Admin';
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
    return stored ? JSON.parse(stored) as User : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (username: string, password: string) => {
    try {
      let email = username.trim();
      // Allow shorthand 'admin' to map to the seeded admin email
      if (email.toLowerCase() === 'admin') {
        email = 'admin@srilankapolice.com';
      }
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) return false;
      const json = await response.json();
      const authData = json.data;
      if (authData && authData.token) {
        localStorage.setItem('police-admin-token', authData.token);
        setUser({ username: authData.email || email, role: 'Super Admin' });
        return true;
      }
    } catch (e) {
      console.error("Backend login request failed", e);
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('police-admin-token');
    setUser(null);
  };

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
