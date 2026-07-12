import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check token and fetch profile on mount
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Set interceptor token and fetch details
          const res = await API.get('/auth/profile');
          if (res.data.success) {
            setUser(res.data.data);
            setIsAuthenticated(true);
          } else {
            handleLogout();
          }
        } catch (err) {
          console.error('Failed to load user session:', err);
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  const login = async (email, password) => {
    try {
      setAuthError(null);
      const res = await API.post('/auth/login', { email, password });
      
      if (res.data.success) {
        const { token: userToken, ...userData } = res.data.data;
        localStorage.setItem('token', res.data.data.token);
        setToken(res.data.data.token);
        setUser({
          _id: res.data.data._id,
          name: res.data.data.name,
          email: res.data.data.email,
          createdAt: res.data.data.createdAt
        });
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    try {
      setAuthError(null);
      const res = await API.post('/auth/register', { name, email, password });
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.data.token);
        setToken(res.data.data.token);
        setUser({
          _id: res.data.data._id,
          name: res.data.data.name,
          email: res.data.data.email,
          createdAt: res.data.data.createdAt
        });
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Email might be already in use.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const updateProfile = async (name, email, password) => {
    try {
      setAuthError(null);
      const payload = { name, email };
      if (password && password.trim() !== '') {
        payload.password = password;
      }
      
      const res = await API.put('/auth/profile', payload);
      
      if (res.data.success) {
        // If password was changed, server might reissue token
        if (res.data.data.token) {
          localStorage.setItem('token', res.data.data.token);
          setToken(res.data.data.token);
        }
        setUser({
          _id: res.data.data._id,
          name: res.data.data.name,
          email: res.data.data.email,
          createdAt: res.data.data.createdAt
        });
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        authError,
        login,
        register,
        logout: handleLogout,
        updateProfile,
        setAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
