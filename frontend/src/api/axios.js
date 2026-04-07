import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

// ================= REQUEST =================
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Không set Content-Type nếu là FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

// ================= RESPONSE =================
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const originalRequest = err.config;

    // Nếu 401 và chưa retry
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Xóa riêng auth
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Tránh redirect loop
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default instance;