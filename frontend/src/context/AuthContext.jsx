import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('habit_tracker_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
          } else {
            logout();
          }
        } catch (err) {
          console.error("Auth initialization failed:", err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, user: userData } = res.data.data;
        localStorage.setItem('habit_tracker_token', token);
        localStorage.setItem('habit_tracker_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        setError(res.data.message || 'Login failed');
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (fullName, email, password, confirmPassword) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', {
        fullName,
        email,
        password,
        confirmPassword,
      });
      if (res.data.success) {
        return { success: true };
      } else {
        setError(res.data.message || 'Registration failed');
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check inputs.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('habit_tracker_token');
    localStorage.removeItem('habit_tracker_user');
    setUser(null);
  };

  const updateProfile = async (fullName, currentPassword, newPassword) => {
    setError(null);
    try {
      const res = await api.put('/profile', {
        fullName,
        currentPassword,
        newPassword
      });
      if (res.data.success) {
        const updatedUser = res.data.data;
        localStorage.setItem('habit_tracker_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      } else {
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
