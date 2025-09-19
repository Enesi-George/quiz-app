import axios, { AxiosError, type AxiosResponse } from "axios";
import { toast } from "react-toastify";
import type { ApiError } from "../types";

// create axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error("Error parsing auth storage:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    const errorData = error.response?.data;
    const message =
      errorData?.error ||
      errorData?.message ||
      error.message ||
      "An error occurred";
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-storage");

      toast.error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      toast.error("Access denied");
    } else if (error.response?.status === 404) {
      toast.error("Resource not found");
    } else if (error.response?.status === 500) {
      toast.error("Server error. Please try again later.");
    } else if (!error.response) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
