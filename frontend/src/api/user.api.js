// src/api/user.api.js
import axiosInstance from "./axios";

// ====================== ADMIN ONLY ======================

// Lấy tất cả user
export const getUsersAPI = async () => {
  const res = await axiosInstance.get("/api/users");
  return res.data;
};

// Xóa user
export const deleteUserAPI = async (userId) => {
  const res = await axiosInstance.delete(`/api/users/${userId}`);
  return res.data;
};

// Cập nhật role user
export const updateUserRoleAPI = async (userId, role) => {
  const res = await axiosInstance.put(`/api/users/${userId}/role`, {
    role,
  });
  return res.data;
};