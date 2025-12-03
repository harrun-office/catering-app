import React, { createContext, useState, useCallback } from 'react';
import { authAPI } from '../utils/api';

// === Helper: Extract userId from stored "user" before logout ===
// (This avoids dependency on CartContext)
function getStoredUserIdSimple() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const u = JSON.parse(raw);

    return (
      u?.id ||
      u?.userId ||
      u?._id ||
      null
    );
  } catch {
    return null;
  }
}

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const response = await authAPI.register(data);
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.errors || error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ⭐⭐⭐ OPTIONAL FIX HERE ⭐⭐⭐
  const logout = useCallback(() => {
    // get userId BEFORE clearing auth

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Cart persistence: We do NOT delete the cart here anymore.
    // This allows the user to see their items when they log back in.

    // Trigger tab sync
    try {
      localStorage.setItem('auth_change_ts', String(Date.now()));
    } catch { }

    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (data) => {
      try {
        await authAPI.updateProfile(data);
        const updatedUser = { ...user, ...data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.message };
      }
    },
    [user]
  );

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
