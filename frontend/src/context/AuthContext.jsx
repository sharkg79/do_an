import { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load user từ localStorage trước (tránh flash)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);

  // ================= FETCH USER =================
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axiosInstance.get("/api/auth/me");

      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
    } catch (err) {
      console.error("Auth error:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ================= LOGIN =================
  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    // redirect an toàn
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook cho tiện dùng
export const useAuth = () => useContext(AuthContext);