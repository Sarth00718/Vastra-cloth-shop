import { createContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

export const userDataContext = createContext();

function UserContext({ children }) {
    const [user, setUser] = useState("");

    const getCurrentUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const result = await authService.getCurrentUser();
            setUser(result);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setUser(null);
            } else {
                console.log("Error fetching current user:", error.message);
                setUser(null);
            }
        }
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    const value = { user, setUser, getCurrentUser };

    return (
        <userDataContext.Provider value={value}>
            {children}
        </userDataContext.Provider>
    );
}

export default UserContext; 