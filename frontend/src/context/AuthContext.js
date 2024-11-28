import React, { createContext, useState, useEffect } from 'react';
import { fetchProfile } from '../services/profileService';

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
                const userData = await fetchProfile(); 
                setUser(userData);
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error fetching profile:', error.message);
                logout(); 
            } finally {
                setLoading(false);
            }
        };

        checkLoginStatus();
    }, []);

    const login = async (token) => {
        if (!token) {
            throw new Error('Token is required to log in.');
        }

        localStorage.setItem('token', token);

        try {
            const userData = await fetchProfile();
            setUser(userData);
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Error during login profile fetch:', error.message);
            logout(); 
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
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
