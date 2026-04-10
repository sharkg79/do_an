// src/api/lesson.api.js
import axiosInstance from "./axios";

// ====================== CREATE LESSON (UPLOAD FILE) ======================
export const createLessonAPI = async (data, file) => {
  const formData = new FormData();

  // append các field
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  // append file
  formData.append("file", file);

  const res = await axiosInstance.post("/api/lessons", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// ====================== GET LESSONS BY CLASS ======================
export const getLessonsByClassAPI = async (classId) => {
  const res = await axiosInstance.get(
    `/api/lessons/class/${classId}`
  );
  return res.data;
};
// ====================== GET ALL LESSONS ======================
export const getAllLessonsAPI = async () => {
  const res = await axiosInstance.get(
    `/api/lessons`
  );
  return res.data;
};
// ====================== UPDATE LESSON ======================
export const updateLessonAPI = async (lessonId, data) => {
  const res = await axiosInstance.put(
    `/api/lessons/${lessonId}`,
    data
  );
  return res.data;
};

// ====================== DELETE LESSON ======================
export const deleteLessonAPI = async (lessonId) => {
  const res = await axiosInstance.delete(
    `/api/lessons/${lessonId}`
  );
  return res.data;
};

// ====================== GET LESSON BY ID ======================
export const getLessonByIdAPI = async (lessonId) => {
  const res = await axiosInstance.get(`/api/lessons/${lessonId}`);
  return res.data;
};
