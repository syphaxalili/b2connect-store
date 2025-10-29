import axiosPrivate from "../config/axiosPrivate";

// Protected routes

export const getOrders = () => axiosPrivate.get("/orders");

export const getOrderById = (id) => axiosPrivate.get(`/orders/${id}`);

export const updateOrderStatus = (id, status, trackingNumber = null) =>
  axiosPrivate.patch(`/orders/${id}/status`, {
    status,
    tracking_number: trackingNumber
  });

export const deleteOrder = (id) => axiosPrivate.delete(`/orders/${id}`);
