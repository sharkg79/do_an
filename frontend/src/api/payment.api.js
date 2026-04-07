// src/api/payment.api.js
import axiosInstance from "./axios";

// ====================== PAY COURSE ======================
export const payCourseAPI = async (courseId) => {
  const res = await axiosInstance.post(
    `/api/payments/${courseId}/pay`
  );
  return res.data;
};

// ====================== CONFIRM PAYMENT ======================
export const confirmPaymentAPI = async (data) => {
  const res = await axiosInstance.post(
    "/api/payments/confirm",
    data
  );
  return res.data;
};
// ================= GET ALL PAYMENTS =================
export const getPaymentsAPI = async () => {
  const res = await axiosInstance.get("/api/payments");
  return res.data;
};
