import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axios";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return; // ⛔ don't call /me without a token
        }

        async function fetchUser() {
            try {
                const response = await axiosInstance.get("/users/me");
                if (mounted) setUser(response.data);
                localStorage.setItem("user", JSON.stringify(response.data));
            } catch (error) {
                setUser(null);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchUser();
        return () => (mounted = false);
    }, []);

    const login = async (email, password) => {
        const response = await axiosInstance.post("/auth/login", { email, password });

        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        setUser(response.data.user || null);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response;
    };

    const register = async (credentials) => {
        const response = await axiosInstance.post("/auth/register", credentials);

        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        return response.data;
    };

    const logout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    }

    const refreshUser = async () => {
        try {
            const response = await axiosInstance.get("/users/me");
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));

            return response.data;
        } catch {
            setUser(null);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
};


