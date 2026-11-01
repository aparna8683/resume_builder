import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_BASE_URL?.trim();
const api = axios.create({
  // Keep browser requests same-origin. Vite proxies /api to the local server in
  // development; production can set VITE_BASE_URL when the API is hosted apart.
  baseURL: configuredBaseUrl || "",
  timeout: 30000,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = token.startsWith("Bearer ")
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
      const endpoint = error.config?.url || "";
      const isAuthEndpoint = /\/api\/users\/(?:login|register|forgot-password|reset-password|data)(?:\?|$)/.test(endpoint);
      if (!isAuthEndpoint) window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;
