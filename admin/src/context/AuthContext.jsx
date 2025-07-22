import React from "react";
import { createContext } from "react";

export const authDataContext = createContext();

function AuthContext({ children }) {
   let serverurl = "http://localhost:3000"
 //let serverurl = "https://vastra-cloth-shop-backend.onrender.com"
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
