import { createContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

export const userDataContext = createContext();

function UserContext({ children }) {
    const [user, setUser] = useState("");

    const getCurrentUser = async () => {
        try {
            const result = await authService.getCurrentUser();
            setUser(result);
            console.log(result);
        } catch (error) {
            if (error.response?.status === 401) {
                console.log("User not authenticated");
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