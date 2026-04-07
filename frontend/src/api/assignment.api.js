import axiosInstance from "./axios";

// ====================== CREATE ======================
export const createAssignmentAPI = async (data) => {
  try {
    const res = await axiosInstance.post("/api/assignments", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Create assignment failed" };
  }
};

// ====================== GET ALL / MY ======================
// admin: tất cả
// instructor: assignment của mình
export const getAssignmentsAPI = async () => {
  try {
    const res = await axiosInstance.get("/api/assignments");
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Fetch assignments failed" };
  }
};

// ====================== UPDATE ======================
export const updateAssignmentAPI = async (assignmentId, data) => {
  try {
    const res = await axiosInstance.put(
      `/api/assignments/${assignmentId}`,
      data
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Update failed" };
  }
};

// ====================== DELETE ======================
export const deleteAssignmentAPI = async (assignmentId) => {
  try {
    const res = await axiosInstance.delete(
      `/api/assignments/${assignmentId}`
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Delete failed" };
  }
};

// ====================== SUBMIT ======================
export const submitAssignmentAPI = async (assignmentId, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.post(
      `/api/assignments/${assignmentId}/submit`,
      formData
    );

    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Submit failed" };
  }
};

// ====================== GRADE ======================
export const gradeSubmissionAPI = async (submissionId, data) => {
  try {
    const res = await axiosInstance.put(
      `/api/assignments/submission/${submissionId}/grade`,
      data
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Grading failed" };
  }
};

// ====================== (OPTIONAL) GET SUBMISSIONS ======================
export const getSubmissionsByAssignmentAPI = async (assignmentId) => {
  try {
    const res = await axiosInstance.get(
      `/api/assignments/${assignmentId}/submissions`
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Fetch submissions failed" };
  }
};