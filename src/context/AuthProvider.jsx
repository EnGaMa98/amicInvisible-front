import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AuthService from '@/api/services/AuthService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('auth_token');

  // Verify session on mount
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    AuthService.me()
      .then((res) => {
        const userData = res.data || res;
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = useCallback((newToken, userData) => {
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch {
      // ignore logout errors
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  }, []);

  const isAdmin = useMemo(() => user?.fields?.is_admin ?? false, [user]);
  const isAuthenticated = !!user && !!token;

  const value = useMemo(
    () => ({ user, loading, isAuthenticated, isAdmin, login, logout, updateUser }),
    [user, loading, isAuthenticated, isAdmin, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
