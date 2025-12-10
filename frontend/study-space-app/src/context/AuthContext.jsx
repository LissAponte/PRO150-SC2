import { createContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../api/authApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });

    if (res.success) {
      setUser(res.user);
      setToken(res.token);
    }

    return res;
  };

  const register = async (name, email, password) => {
    const res = await registerUser({ name, email, password });
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );

}
