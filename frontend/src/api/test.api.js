// src/api/test.api.js
import axiosInstance from "./axios";

// ====================== CREATE TEST ======================
export const createTestAPI = async (data) => {
  const res = await axiosInstance.post("/api/tests", data);
  return res.data;
};

// ====================== UPDATE TEST ======================
export const updateTestAPI = async (testId, data) => {
  const res = await axiosInstance.put(
    `/api/tests/${testId}`,
    data
  );
  return res.data;
};

// ====================== DELETE TEST ======================
export const deleteTestAPI = async (testId) => {
  const res = await axiosInstance.delete(
    `/api/tests/${testId}`
  );
  return res.data;
};

// ====================== GET TESTS BY COURSE ======================
export const getTestsByCourseAPI = async (courseId) => {
  const res = await axiosInstance.get(
    `/api/tests/course/${courseId}`
  );
  return res.data;
};

// ====================== SUBMIT TEST ======================
export const submitTestAPI = async (testId, answers) => {
  const res = await axiosInstance.post(
    `/api/tests/${testId}/submit`,
    { answers } // gửi danh sách đáp án
  );
  return res.data;
};

// ====================== GET SUBMISSIONS (INSTRUCTOR) ======================
export const getTestSubmissionsAPI = async (testId) => {
  const res = await axiosInstance.get(
    `/api/tests/${testId}/submissions`
  );
  return res.data;
};