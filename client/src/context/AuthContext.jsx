import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('freshmart_token') || '');
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('freshmart_token');
      const storedUser = localStorage.getItem('freshmart_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify with backend
          const me = await api.getMe();
          setUser(me);
          localStorage.setItem('freshmart_user', JSON.stringify(me));
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setToken(data.token);
    const userInfo = { _id: data._id, name: data.name, email: data.email, role: data.role };
    setUser(userInfo);
    localStorage.setItem('freshmart_token', data.token);
    localStorage.setItem('freshmart_user', JSON.stringify(userInfo));
    setAuthModalOpen(false);
    return userInfo;
  };

  const register = async (name, email, password) => {
    const data = await api.register(name, email, password);
    setToken(data.token);
    const userInfo = { _id: data._id, name: data.name, email: data.email, role: data.role };
    setUser(userInfo);
    localStorage.setItem('freshmart_token', data.token);
    localStorage.setItem('freshmart_user', JSON.stringify(userInfo));
    setAuthModalOpen(false);
    return userInfo;
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('freshmart_token');
    localStorage.removeItem('freshmart_user');
  };

  const openAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    authModalOpen,
    authModalMode,
    openAuth,
    closeAuth,
    setAuthModalMode
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
