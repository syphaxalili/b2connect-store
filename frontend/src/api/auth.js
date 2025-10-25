import axios from "./axiosInstance";

export const login = (data) => axios.post("/auth/login", data);
export const register = (data) => axios.post("/auth/register", data);
