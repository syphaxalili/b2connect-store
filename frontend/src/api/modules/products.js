import axiosPrivate from "../config/axiosPrivate";
import axiosPublic from "../config/axiosPublic";

// Public routes

export const getProducts = (params = {}) => axiosPublic.get("/products", { params });

export const getDistinctBrands = () => axiosPublic.get("/products/filters/brands");

export const getProductById = (id) => axiosPublic.get(`/products/${id}`);

// Protected routes

export const createProduct = (data) => axiosPrivate.post("/products", data);

export const updateProduct = (id, data) =>
  axiosPrivate.put(`/products/${id}`, data);

export const deleteProduct = (id) => axiosPrivate.delete(`/products/${id}`);
