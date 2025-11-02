import axiosPrivate from "../config/axiosPrivate";
import axiosPublic from "../config/axiosPublic";

// Public routes

export const login = (data) => axiosPublic.post("/auth/login", data);
export const register = (data) => axiosPublic.post("/auth/register", data);

export const requestPasswordReset = (data) =>
  axiosPublic.post("/auth/request-password-reset", data);
export const resetPassword = (data) =>
  axiosPublic.post("/auth/reset-password", data);
export const verifyResetToken = (token) =>
  axiosPublic.get("/auth/verify-reset-token", { params: { token } });

export const getCurrentUser = () => axiosPublic.get("/auth/me");

// Protected routes
export const logout = () => axiosPrivate.post("/auth/logout");
export const refreshToken = () => axiosPrivate.post("/auth/refresh");
