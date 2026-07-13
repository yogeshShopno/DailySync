import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

// Enforce HTTPS in non-development environments
if (
  typeof window !== "undefined" &&
  process.env.NODE_ENV !== "development" &&
  !API_BASE_URL.startsWith("https://")
) {
  console.warn("WARNING: API_BASE_URL must use HTTPS in production.");
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ─────────────────────────────────────────────────────
// Attaches the JWT token from localStorage to every request automatically
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("dailysync-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ────────────────────────────────────────────────────
// Handles 401 Unauthorized globally — clears auth and redirects to root
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("dailysync-token");
        localStorage.removeItem("dailysync-auth");
        // Only redirect if not already on root (login screen)
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
