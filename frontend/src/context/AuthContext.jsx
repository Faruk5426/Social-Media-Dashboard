import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, fetchMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('pulse_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('pulse_token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem('pulse_user', JSON.stringify(res.data.user));
      })
      .catch(() => {
        localStorage.removeItem('pulse_token');
        localStorage.removeItem('pulse_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    localStorage.setItem('pulse_token', res.data.token);
    localStorage.setItem('pulse_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const register = async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    localStorage.setItem('pulse_token', res.data.token);
    localStorage.setItem('pulse_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('pulse_token');
    localStorage.removeItem('pulse_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
