import axiosPrivate from "../config/axiosPrivate";

// Protected routes

export const createOrder = (product_ids, quantities, shipping_fee = 5.99) =>
  axiosPrivate.post("/orders", {
    product_ids,
    quantities,
    shipping_fee
  });

export const getOrders = () => axiosPrivate.get("/orders");

export const getUserOrders = () => axiosPrivate.get("/orders/my-orders");

export const getOrderById = (id) => axiosPrivate.get(`/orders/${id}`);

export const updateOrderStatus = (id, status, trackingNumber = null) =>
  axiosPrivate.patch(`/orders/${id}/status`, {
    status,
    tracking_number: trackingNumber
  });

export const deleteOrder = (id) => axiosPrivate.delete(`/orders/${id}`);
