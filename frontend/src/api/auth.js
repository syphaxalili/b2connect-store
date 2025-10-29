import axios from "./axiosInstance";

export const login = (data) => axios.post("/auth/login", data);
export const register = (data) => axios.post("/auth/register", data);
export const requestPasswordReset = (data) =>
  axios.post("/auth/request-password-reset", data);
export const resetPassword = (data) => axios.post("/auth/reset-password", data);
export const verifyResetToken = (token) =>
  axios.get("/auth/verify-reset-token", { params: { token } });
