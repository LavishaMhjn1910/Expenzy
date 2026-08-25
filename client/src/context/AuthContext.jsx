import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('expenzy_token');
    const cachedUser = localStorage.getItem('expenzy_user');

    if (token && cachedUser) {
      setUser(JSON.parse(cachedUser));
      api
        .get('/auth/me')
        .then(({ data }) => {
          setUser(data.user);
          localStorage.setItem('expenzy_user', JSON.stringify(data.user));
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const persist = (token, userData) => {
    localStorage.setItem('expenzy_token', token);
    localStorage.setItem('expenzy_user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data.token, data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    persist(data.token, data.user);
    return data.user;
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const { data } = await api.put('/auth/me', updates);
    localStorage.setItem('expenzy_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('expenzy_token');
    localStorage.removeItem('expenzy_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
