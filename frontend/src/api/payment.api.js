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
// ⚠️ Thường không gọi từ frontend (gateway gọi)
// nhưng vẫn viết để test nếu cần
export const confirmPaymentAPI = async (data) => {
  const res = await axiosInstance.post(
    "/api/payments/confirm",
    data
  );
  return res.data;
};