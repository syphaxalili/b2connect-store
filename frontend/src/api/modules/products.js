import axiosPrivate from "../config/axiosPrivate";
import axiosPublic from "../config/axiosPublic";

// Public routes

export const getProducts = () => axiosPublic.get("/products");

export const getProductById = (id) => axiosPublic.get(`/products/${id}`);

// Protected routes

export const createProduct = (data) => axiosPrivate.post("/products", data);

export const updateProduct = (id, data) =>
  axiosPrivate.put(`/products/${id}`, data);

export const deleteProduct = (id) => axiosPrivate.delete(`/products/${id}`);
