import React, { createContext, useContext, useEffect, useState } from 'react';
import { authDataContext } from './AuthContext';
import axios from 'axios';

export const adminDataContext = createContext();

function AdminContext({ children }) {
    const [admin, setAdmin] = useState(null);
    const { serverurl } = useContext(authDataContext);

    const getAdmin = async () => {
        try {
            const result = await axios.post(`${serverurl}/api/user/getadmin`, {}, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setAdmin(result.data);
            console.log(result.data);

        } catch (error) {
            setAdmin(null);
            console.log("Error fetching current user:", error.message);
        }
    };

    useEffect(() => {
        getAdmin();
    }, []);
  
    const value = { admin, setAdmin, getAdmin };

    return (
        <adminDataContext.Provider value={value}>
            {children}
        </adminDataContext.Provider>
    );
}

export default AdminContext; 