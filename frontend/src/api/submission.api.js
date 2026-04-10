import axiosInstance from "./axios";

// ================= GET ALL =================
export const getSubmissionsAPI = async (assignmentId) => {
  const res = await axiosInstance.get("/api/submissions", {
    params: { assignmentId },
  });
  return res.data;
};

// ================= GET BY ASSIGNMENT =================
export const getSubmissionsByAssignmentAPI = async (assignmentId) => {
  const res = await axiosInstance.get(
    `/api/submissions/assignment/${assignmentId}`
  );
  return res.data;
};

// ================= GRADE =================
export const gradeSubmissionAPI = async (submissionId, data) => {
  const res = await axiosInstance.put(
    `/api/submissions/${submissionId}/grade`,
    data
  );
  return res.data;
};

// ================= DELETE =================
export const deleteSubmissionAPI = async (submissionId) => {
  const res = await axiosInstance.delete(
    `/api/submissions/${submissionId}`
  );
  return res.data;
};