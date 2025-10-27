import axios from "./axiosInstance";

export const getOrders = () => axios.get("/orders");
export const getOrderById = (id) => axios.get(`/orders/${id}`);
export const updateOrderStatus = (id, status, trackingNumber = null) =>
  axios.patch(`/orders/${id}/status`, { status, tracking_number: trackingNumber });
export const deleteOrder = (id) => axios.delete(`/orders/${id}`);
