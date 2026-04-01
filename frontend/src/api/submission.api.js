// src/api/submission.api.js
import axiosInstance from "./axios";

// ====================== SUBMIT (UPLOAD FILE) ======================
export const submitAssignmentAPI = async (assignmentId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post(
    `/api/submissions/${assignmentId}`,
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
    `/api/submissions/${submissionId}/grade`,
    data
  );
  return res.data;
};

// ====================== GET ALL BY ASSIGNMENT ======================
export const getSubmissionsByAssignmentAPI = async (assignmentId) => {
  const res = await axiosInstance.get(
    `/api/submissions/assignment/${assignmentId}`
  );
  return res.data;
};

// ====================== GET MY SUBMISSIONS ======================
export const getMySubmissionsAPI = async () => {
  const res = await axiosInstance.get("/api/submissions/my");
  return res.data;
};

// ====================== GET DETAIL ======================
export const getSubmissionDetailAPI = async (submissionId) => {
  const res = await axiosInstance.get(
    `/api/submissions/detail/${submissionId}`
  );
  return res.data;
};

// ====================== DELETE ======================
export const deleteSubmissionAPI = async (submissionId) => {
  const res = await axiosInstance.delete(
    `/api/submissions/${submissionId}`
  );
  return res.data;
};