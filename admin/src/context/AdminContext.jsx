import { createContext, useEffect, useState } from 'react';
import { adminService } from '../services/adminService';

export const adminDataContext = createContext();

function AdminContext({ children }) {
    const [admin, setAdmin] = useState(null);

    const getAdmin = async () => {
        try {
            const result = await adminService.getAdmin();
            setAdmin(result);
            console.log(result);
        } catch (error) {
            setAdmin(null);
            console.log("Error fetching admin:", error.message);
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