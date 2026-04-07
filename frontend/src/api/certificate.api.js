// src/api/certificate.api.js
import axiosInstance from "./axios";

// ====================== GENERATE CERTIFICATE ======================
export const generateCertificateAPI = async (courseId) => {
  const res = await axiosInstance.post(
    `/api/certificates/generate/${courseId}`
  );
  return res.data;
};

// ====================== GET MY CERTIFICATES ======================
export const getMyCertificatesAPI = async () => {
  const res = await axiosInstance.get("/api/certificates/my");
  return res.data;
};
// ================= CREATE =================
export const createCertificateAPI = async (data) => {
  const res = await axiosInstance.post("/api/certificates", data);
  return res.data;
};

// ================= GET ALL =================
export const getAllCertificatesAPI = async () => {
  const res = await axiosInstance.get("/api/certificates");
  return res.data;
};

// ================= DELETE =================
export const deleteCertificateAPI = async (id) => {
  const res = await axiosInstance.delete(`/api/certificates/${id}`);
  return res.data;
};