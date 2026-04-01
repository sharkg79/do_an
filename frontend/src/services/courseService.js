import axios from "axios";

const API = "http://localhost:5000/api/courses";

export const getCourses = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};