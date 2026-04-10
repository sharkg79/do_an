import axiosInstance from "./axios";
// GET MY
export const getMyCertificatesAPI = async () => {
  const res = await axiosInstance.get("/api/certificates/my");
  return res.data;
};

// ADMIN GET ALL
export const getAllCertificatesAPI = async () => {
  const res = await axiosInstance.get("/api/certificates");
  return res.data;
};

// DELETE
export const deleteCertificateAPI = async (id) => {
  const res = await axiosInstance.delete(`/api/certificates/${id}`);
  return res.data;
};
// UPDATE
export const updateCertificateAPI = async (id, data) => {
  const res = await axiosInstance.put(`/api/certificates/${id}`, data);
  return res.data;
};

// GET DETAIL
export const getCertificateByIdAPI = async (id) => {
  const res = await axiosInstance.get(`/api/certificates/${id}`);
  return res.data;
};