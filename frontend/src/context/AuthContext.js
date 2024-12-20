import React, { createContext, useState, useEffect } from 'react';
import { getProfileRequest } from '../services/userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userData = await getProfileRequest();
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error geting profile:', error.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (token) => {
    if (!token) {
      throw new Error('Token jest wymagany do zalogowania.');
    }

    localStorage.setItem('token', token);

    try {
      const userData = await getProfileRequest();
      setUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error during login profile get:', error.message);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
