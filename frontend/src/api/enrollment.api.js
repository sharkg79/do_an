import axios from "./axios";

export const createPaymentAPI = (data) =>
  axios.post("/api/enrollments/create-payment", data);

export const confirmPaymentAPI = (data) =>
  axios.post("/api/enrollments/confirm-payment", data);

export const checkEnrollmentAPI = (courseId) =>
  axios.get(`/api/enrollments/check/${courseId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });