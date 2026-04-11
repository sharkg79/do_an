import axios from "./axios";



const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

export const createPaymentAPI = (data) =>
  axios.post("/api/enrollments/create-payment", data, {
    headers: authHeader()
  });

export const confirmPaymentAPI = (data) =>
  axios.post("/api/enrollments/confirm-payment", data, {
    headers: authHeader()
  });

export const checkEnrollmentAPI = (courseId) =>
  axios.get(`/api/enrollments/check/${courseId}`, {
    headers: authHeader()
    }
  );