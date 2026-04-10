// src/api/course.api.js
import axiosInstance from "./axios";

// ====================== PUBLIC ======================

// Lấy tất cả khóa học
export const getCoursesAPI = async () => {
  const res = await axiosInstance.get("/api/courses");
  return res.data;
};

// Lấy chi tiết 1 khóa học
export const getCourseByIdAPI = async (id) => {
  const res = await axiosInstance.get(`/api/courses/${id}`);
  return res.data;
};

// ====================== PROTECTED ======================

// Tạo khóa học (ADMIN / INSTRUCTOR)
export const createCourseAPI = async (data) => {
  const res = await axiosInstance.post("/api/courses", data);
  return res.data;
};

// Cập nhật khóa học
export const updateCourseAPI = async (id, data) => {
  const res = await axiosInstance.put(`/api/courses/${id}`, data);
  return res.data;
};

// Xóa khóa học
export const deleteCourseAPI = async (id) => {
  const res = await axiosInstance.delete(`/api/courses/${id}`);
  return res.data;
};

export const getInstructorCoursesFullAPI = async () => {
  const res = await axiosInstance.get("/api/courses/instructor/full");
  return res.data;
};