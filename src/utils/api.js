import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

const normalizeApiError = (error, fallbackMessage) => {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const message =
    (typeof data === "object" && data?.message) ||
    (typeof data === "string" && data.trim()) ||
    (status ? `Request failed with status ${status}` : "") ||
    fallbackMessage;

  return { message, status, data };
};

const persistAuth = (token, user) => {
  if (token) {
    localStorage.setItem("token", token);
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await API.post("/login", credentials);
    const token = res.data?.token || res.data?.data?.accessToken;
    const user = res.data?.user;
    persistAuth(token, user);
    return { token, user, raw: res.data };
  } catch (error) {
    throw normalizeApiError(error, "Login failed");
  }
};

export const registerUser = async (payload) => {
  try {
    const res = await API.post("/register", payload);
    const token = res.data?.token || res.data?.data?.accessToken;
    const user = res.data?.user || {
      name: payload.name,
      email: payload.email,
      userName: payload.userName,
      phone: payload.phone,
      country: payload.country,
    };
    persistAuth(token, user);
    return res.data;
  } catch (error) {
    throw normalizeApiError(error, "Registration failed");
  }
};

export const getUserProfile = async () => {
  try {
    const res = await API.get("/info");
    return res.data;
  } catch (error) {
    throw normalizeApiError(error, "Failed to fetch profile");
  }
};

export const getUserCart = async () => {
  try {
    const res = await API.get("/api/v1/cart/get-user-cart");
    return res.data;
  } catch (error) {
    throw normalizeApiError(error, "Failed to fetch cart");
  }
};

export const getUserOrders = async () => {
  try {
    const res = await API.get("/api/v1/orders/user-orders");
    return res.data;
  } catch (error) {
    throw normalizeApiError(error, "Failed to fetch orders");
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  delete API.defaults.headers.common["Authorization"];
};

const token = localStorage.getItem("token");
if (token) {
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default API;
