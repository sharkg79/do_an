// src/api/report.api.js
import axiosInstance from "./axios";

// ====================== DASHBOARD SUMMARY ======================
export const getDashboardSummaryAPI = async () => {
  const res = await axiosInstance.get("/api/reports/summary");
  return res.data;
};

// ====================== COURSE PROGRESS ======================
export const getCourseProgressAPI = async () => {
  const res = await axiosInstance.get("/api/reports/course-progress");
  return res.data;
};