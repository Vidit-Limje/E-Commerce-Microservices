import axios from "axios";

const AUTH_BASE = "http://localhost:8001/auth";
const PRODUCT_BASE = "http://localhost:4001/products";
const CART_BASE = "http://localhost:4003/cart";
const ORDER_BASE = "http://localhost:4002/orders";


const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* AUTH */
export const signup = (data) => api.post(`${AUTH_BASE}/signup`, data);
export const login = async (data) => {
  const res = await api.post(`${AUTH_BASE}/login`, data);
  localStorage.setItem("token", res.data.access_token);
  return res;
};

/* PRODUCTS */
export const getProducts = () => api.get(PRODUCT_BASE);

/* CART */
export const addToCart = (product) =>
  api.post(`${CART_BASE}/add`, product);

export const getCart = () => api.get(CART_BASE);

export const removeCartItem = (data) =>
  api.delete(`${CART_BASE}/remove-item`, { data });

export const clearCart = () => api.delete(`${CART_BASE}/clear`);

/* ORDERS */
export const createOrderFromCart = () =>
  api.post(`${ORDER_BASE}/from-cart`);

export const getOrders = () => api.get(ORDER_BASE);
