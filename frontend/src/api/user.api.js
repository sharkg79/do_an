import axios from "./axios";

const userApi = {
  getProfile: () => axios.get("/users/me"),
  updateProfile: (data) => axios.put("/users/me", data),
  changePassword: (data) => axios.put("/users/change-password", data),
};

export default userApi;