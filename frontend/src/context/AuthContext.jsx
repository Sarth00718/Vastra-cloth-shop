import { createContext } from "react";

export const authDataContext = createContext();

function AuthContext({ children }) {
    let serverurl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // let serverurl = "https://vastra-cloth-shop-backend.onrender.com"
    let value = {
        serverurl
    }
    return (
        <div>
            <authDataContext.Provider value={value}>
                {children}
            </authDataContext.Provider>
        </div>
    )
}

export default AuthContext
