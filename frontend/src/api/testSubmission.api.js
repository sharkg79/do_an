import axiosInstance from "./axios";

// ================= GET ALL =================
export const getTestSubmissionsAPI = async (testId) => {
  const res = await axiosInstance.get("/api/test-submissions", {
    params: { testId },
  });
  return res.data;
};

// ================= GET BY TEST =================
export const getTestSubmissionsByTestAPI = async (testId) => {
  const res = await axiosInstance.get(
    `/api/test-submissions/test/${testId}`
  );
  return res.data;
};

// ================= AUTO GRADE =================
export const gradeTestSubmissionAPI = async (submissionId) => {
  const res = await axiosInstance.put(
    `/api/test-submissions/${submissionId}/grade`
  );
  return res.data;
};

// ================= DELETE =================
export const deleteTestSubmissionAPI = async (submissionId) => {
  const res = await axiosInstance.delete(
    `/api/test-submissions/${submissionId}`
  );
  return res.data;
};