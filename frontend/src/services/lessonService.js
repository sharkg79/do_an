import axios from "axios";

const API = "http://localhost:5000/api/lessons";

export const getLessonsByCourse = async (courseId) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API}/course/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data.lessons;
};