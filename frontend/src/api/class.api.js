// src/api/class.api.js
import axiosInstance from "./axios";

// ====================== CREATE CLASS ======================
export const createClassAPI = async (data) => {
  const res = await axiosInstance.post("/api/classes", data);
  return res.data;
};

// ====================== GET ALL CLASSES ======================
export const getAllClassesAPI = async () => {
  const res = await axiosInstance.get("/api/classes");
  return res.data;
};

// ====================== GET CLASS BY ID ======================
export const getClassByIdAPI = async (id) => {
  const res = await axiosInstance.get(`/api/classes/${id}`);
  return res.data;
};

// ====================== ENROLL CLASS (STUDENT) ======================
export const enrollClassAPI = async (classId) => {
  const res = await axiosInstance.post(
    `/api/classes/${classId}/enroll`
  );
  return res.data;
};

// ====================== UPDATE CLASS ======================
export const updateClassAPI = async (id, data) => {
  const res = await axiosInstance.put(`/api/classes/${id}`, data);
  return res.data;
};

// ====================== DELETE CLASS ======================
export const deleteClassAPI = async (id) => {
  const res = await axiosInstance.delete(`/api/classes/${id}`);
  return res.data;
};