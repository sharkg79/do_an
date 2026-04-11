// src/api/user.api.js
import axiosInstance from "./axios";

// ====================== ADMIN ONLY ======================

// Lấy tất cả user
export const getUsersAPI = async () => {
  const res = await axiosInstance.get("/api/users");
  return res.data;
};
export const getUserByIdAPI = async (userId) => {
  const res = await axiosInstance.get(`/api/users/${userId}`);
  return res.data;
}
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
// Tạo user
export const createUserAPI = async (data) => {
  const res = await axiosInstance.post("/api/users", data);
  return res.data;
};
// Cập nhật user
export const updateMeAPI = (data) =>
  axiosInstance.put("/api/users/me", data);
export const getUsersByClassAPI = async (classId) => {
  const res = await axiosInstance.get(`/api/classes/${classId}/users`);
  return res.data;
};
export const getMeAPI = () =>
  axiosInstance.get("/api/users/me");