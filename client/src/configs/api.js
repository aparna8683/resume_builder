
import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_BASE_URL?.trim();

const api = axios.create({
  baseURL: configuredBaseUrl
    ? configuredBaseUrl.replace(/\/+$/, "")
    : "",
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = /^Bearer\s+/i.test(token)
        ? token
        : `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      if (window.location.pathname.startsWith("/app")) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
