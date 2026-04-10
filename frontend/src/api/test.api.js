import axiosInstance from "./axios";

// GET
export const getTestsAPI = async (classId) => {
  const res = await axiosInstance.get("/api/tests", {
    params: { classId },
  });
  return res.data;
};

// CREATE
export const createTestAPI = async (data) => {
  const res = await axiosInstance.post("/api/tests", data);
  return res.data;
};

// UPDATE
export const updateTestAPI = async (id, data) => {
  const res = await axiosInstance.put(`/api/tests/${id}`, data);
  return res.data;
};

// DELETE
export const deleteTestAPI = async (id) => {
  const res = await axiosInstance.delete(`/api/tests/${id}`);
  return res.data;
};

// SUBMIT
export const submitTestAPI = async (testId, answers) => {
  const res = await axiosInstance.post(
    `/api/tests/${testId}/submit`,
    { answers }
  );
  return res.data;
};

// GET SUBMISSIONS
export const getTestSubmissionsAPI = async (testId) => {
  const res = await axiosInstance.get(
    `/api/tests/${testId}/submissions`
  );
  return res.data;
};