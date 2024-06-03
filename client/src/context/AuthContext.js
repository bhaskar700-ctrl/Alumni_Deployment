import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Attempt to get a saved user from localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) { // Only parse if `savedUser` is truthy
            try {
                return JSON.parse(savedUser);
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
                return null;
            }
        }
        return null;
    });
    const [error, setError] = useState('');

    const login = async (email, password) => {
        setError(''); // Clear any existing errors
        try {
            const { data } = await axios.post('http://localhost:3000/api/users/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || 'An error occurred');
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    useEffect(() => {
        // Implement any startup logic, such as validating the token
        console.log("Auth provider mounted.");
    }, []);

    const value = {
        user,
        login,
        logout,
        error
    };

    console.log("Value:", value); // Log the value being provided

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
