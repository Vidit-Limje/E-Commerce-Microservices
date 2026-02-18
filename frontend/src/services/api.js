import axios from "axios";

const AUTH_BASE = "http://localhost:8001/auth";
const INVENTORY_BASE = "http://localhost:8002/inventory";

export const signup = (data) =>
  axios.post(`${AUTH_BASE}/signup`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

export const login = async (data) => {
  const res = await axios.post(`${AUTH_BASE}/login`, data);
  localStorage.setItem("token", res.data.access_token);
  return res;
};

export const getToken = () => localStorage.getItem("token");

export const addStock = (data) =>
  axios.post(`${INVENTORY_BASE}/add-stock`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

export const checkStock = (productId) =>
  axios.get(`${INVENTORY_BASE}/check/${productId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
