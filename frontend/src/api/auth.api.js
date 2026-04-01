// src/api/auth.api.js
import axiosInstance from "./axios"; // file bạn vừa gửi

// ====================== REGISTER ======================
export const registerAPI = async (data) => {
  const res = await axiosInstance.post("/api/auth/register", data);
  return res.data;
};

// ====================== LOGIN ======================
export const loginAPI = async (data) => {
  const res = await axiosInstance.post("/api/auth/login", data);

  // lưu token + user
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }

  return res.data;
};

// ====================== LOGOUT ======================
export const logoutAPI = () => {
  localStorage.clear();
  window.location.href = "/login";
};

// ====================== GET USER ======================
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};