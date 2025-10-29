import axiosPrivate from "../config/axiosPrivate";
import axiosPublic from "../config/axiosPublic";

// Public routes

export const getCategories = () => axiosPublic.get("/categories");

export const getCategoryById = (id) => axiosPublic.get(`/categories/${id}`);

// Protected routes

export const createCategory = (data) => axiosPrivate.post("/categories", data);

export const updateCategory = (id, data) =>
  axiosPrivate.put(`/categories/${id}`, data);

export const deleteCategory = (id) => axiosPrivate.delete(`/categories/${id}`);
