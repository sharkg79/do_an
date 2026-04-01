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