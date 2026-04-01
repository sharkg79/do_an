// src/api/assignment.api.js
import axiosInstance from "./axios";

// ====================== CREATE ======================
export const createAssignmentAPI = async (data) => {
  const res = await axiosInstance.post("/api/assignments", data);
  return res.data;
};

// ====================== GET ======================
export const getAssignmentsByCourseAPI = async (courseId) => {
  const res = await axiosInstance.get(
    `/api/assignments/course/${courseId}`
  );
  return res.data;
};

// ====================== UPDATE ======================
export const updateAssignmentAPI = async (assignmentId, data) => {
  const res = await axiosInstance.put(
    `/api/assignments/${assignmentId}`,
    data
  );
  return res.data;
};

// ====================== DELETE ======================
export const deleteAssignmentAPI = async (assignmentId) => {
  const res = await axiosInstance.delete(
    `/api/assignments/${assignmentId}`
  );
  return res.data;
};

// ====================== SUBMIT (UPLOAD FILE) ======================
export const submitAssignmentAPI = async (assignmentId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post(
    `/api/assignments/${assignmentId}/submit`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

// ====================== GRADE ======================
export const gradeSubmissionAPI = async (submissionId, data) => {
  const res = await axiosInstance.put(
    `/api/assignments/submission/${submissionId}/grade`,
    data
  );
  return res.data;
};