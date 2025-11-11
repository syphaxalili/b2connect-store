import axiosPrivate from "../config/axiosPrivate";

// Protected routes

export const getUsers = (params = {}) => axiosPrivate.get("/users", { params });

export const getUserById = (id) => axiosPrivate.get(`/users/${id}`);

export const createUser = (data) => axiosPrivate.post("/users", data);

export const updateUser = (id, data) => axiosPrivate.put(`/users/${id}`, data);

export const deleteUser = (id) => axiosPrivate.delete(`/users/${id}`);
