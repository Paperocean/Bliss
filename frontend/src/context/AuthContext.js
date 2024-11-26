import React, { createContext, useState, useEffect } from 'react';
import fetchProfile from '../services/userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }

      try {
        const userData = await fetchProfile(); 
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error fetching profile:', error.message);
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('token');
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (token, userData) => {
    if (!token || !userData) {
        throw new Error('Invalid login data');
    }
    localStorage.setItem('token', token); 
    setUser(userData); 
    setIsLoggedIn(true);
    try {
        const fetchedUser = await fetchProfile();
        setUser(fetchedUser);
    } catch (error) {
        console.error('Error validating user after login:', error.message);
        logout();
    }
};


  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
