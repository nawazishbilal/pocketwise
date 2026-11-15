import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore authentication on page refresh
    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/auth/me');
                setUser(response.data.user);
            } catch (error) {
                localStorage.removeItem('token');
                setUser(null);
                console.log(error)
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, []);

    // Register
    const register = async (name, email, password) => {
        const response = await api.post('/auth/register', {
            name,
            email,
            password
        });

        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);

        return response.data;
    };

    // Login
    const login = async (email, password) => {
        const response = await api.post('/auth/login', {
            email,
            password
        });

        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);

        return response.data;
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                register,
                login,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);