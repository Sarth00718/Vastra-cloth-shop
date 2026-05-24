import { createContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

export const userDataContext = createContext();

function UserContext({ children }) {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    const getCurrentUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setAdmin(null);
            setLoading(false);
            return;
        }

        try {
            const result = await authService.getCurrentUser();
            setUser(result);
            // Automatically sync admin state if user is admin
            if (result && result.role === 'admin') {
                setAdmin({ email: result.email, role: 'admin' });
            } else {
                setAdmin(null);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setUser(null);
                setAdmin(null);
            } else {
                console.log("Error fetching current user:", error.message);
                setUser(null);
                setAdmin(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    const value = { user, setUser, admin, setAdmin, getCurrentUser, loading };

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    );
}

export default UserContext; 