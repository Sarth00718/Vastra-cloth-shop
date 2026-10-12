import { createContext, useState } from "react";
import { authService } from "../services/authService";
import toast from "react-hot-toast";

export const authDataContext = createContext();

function AuthContext({ children }) {
    const serverurl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5001' : 'http://vastra-backend-env.eba-ipgmtvpc.us-east-1.elasticbeanstalk.com');
    const [authLoading, setAuthLoading] = useState(false);

    const loginUser = async (email, password) => {
        setAuthLoading(true);
        try {
            const data = await authService.login({ email, password });
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            return data;
        } catch (error) {
            const errorMsg = error?.response?.data?.message || error?.response?.data?.msg || "Login failed. Please check your credentials.";
            toast.error(errorMsg);
            throw error;
        } finally {
            setAuthLoading(false);
        }
    };

    const registerUser = async (name, email, password) => {
        setAuthLoading(true);
        try {
            const data = await authService.register({ name, email, password });
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            return data;
        } catch (error) {
            const errorMsg = error?.response?.data?.message || error?.response?.data?.msg || "Registration failed!";
            toast.error(errorMsg);
            throw error;
        } finally {
            setAuthLoading(false);
        }
    };

    const googleLoginUser = async (name, email, googleId) => {
        setAuthLoading(true);
        try {
            const data = await authService.googleLogin({ name, email, googleId });
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            return data;
        } catch (error) {
            const errorMsg = error?.response?.data?.message || error?.response?.data?.msg || "Google login failed.";
            toast.error(errorMsg);
            throw error;
        } finally {
            setAuthLoading(false);
        }
    };

    const logoutUser = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("token");
            toast.success("Logged out successfully");
        }
    };

    const value = {
        serverurl,
        authLoading,
        loginUser,
        registerUser,
        googleLoginUser,
        logoutUser
    };

    return (
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>
    );
}

export default AuthContext;
