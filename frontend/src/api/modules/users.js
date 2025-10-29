import axiosPrivate from "../config/axiosPrivate";

// Protected routes

export const getUsers = () => axiosPrivate.get("/users");

export const getUserById = (id) => axiosPrivate.get(`/users/${id}`);

export const createUser = (data) => axiosPrivate.post("/users", data);

export const updateUser = (id, data) => axiosPrivate.put(`/users/${id}`, data);

export const deleteUser = (id) => axiosPrivate.delete(`/users/${id}`);
