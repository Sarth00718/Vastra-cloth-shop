import React, { createContext, useContext, useEffect, useState } from 'react';
import { authDataContext } from './AuthContext.jsx';
import axios from 'axios';

export const userDataContext = createContext();

function UserContext({ children }) {
    const [user, setUser] = useState("");
    const { serverurl } = useContext(authDataContext);

    const getCurrentUser = async () => {
        try {
            const result = await axios.post(`${serverurl}/api/user/getcurrentuser`, {}, {
                withCredentials: true,
            });
            setUser(result.data);
            console.log(result.data);
        } catch (error) {
            setUser(null);
            console.log("Error fetching current user:", error.message);
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