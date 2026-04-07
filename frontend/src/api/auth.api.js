// src/api/auth.api.js

import axiosInstance from "./axios";

// ====================== REGISTER ======================
export const registerAPI = async (data) => {
  try {
    const res = await axiosInstance.post("/api/auth/register", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Register failed" };
  }
};

// ====================== LOGIN ======================
export const loginAPI = async (data) => {
  try {
    const res = await axiosInstance.post("/api/auth/login", data);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

// ====================== LOGOUT ======================
export const logoutAPI = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/login";
};

// ====================== GET CURRENT USER ======================
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");

    // Không có token → không gọi API
    if (!token) return null;

    const res = await axiosInstance.get("/api/auth/me");

    // Sync lại user
    localStorage.setItem("user", JSON.stringify(res.data));

    return res.data;
  } catch (err) {
    // Token lỗi → logout luôn cho sạch state
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return null;
  }
};