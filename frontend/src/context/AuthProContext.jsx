import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('authUser'));
        if (user) {
            setAuthUser(user);
        }
    }, []);

    const login = (userData) => {
        setAuthUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await axios.post('/api/pros/logout');
            setAuthUser(null);
            localStorage.removeItem('authUser');
        } catch (error) {
            console.error('Logout error:', error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ authUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
