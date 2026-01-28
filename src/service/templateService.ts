// src/services/templateService.ts
import axios from "axios";

const API = axios.create({
  baseURL: "https://ayuchatadmin.agnistokatechnology.com/api",
  withCredentials: true, // required if using Sanctum/cookie auth
});

// Add a request interceptor to automatically include the token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const TemplateService = {
  // Create a new template with media files
  create: async (data: FormData) => {
    return await API.post("/templates", data, {
      headers: {
        "Content-Type": "multipart/form-data", // required for FormData
      },
    });
  },

  // Get all templates with optional query params
  getAll: async (params?: Record<string, any>) => {
    return await API.get("/templates", { params });
  },

  // Get a specific template by ID
  getById: async (id: number) => {
    return await API.get(`/templates/${id}`);
  },

  // Update a template by ID
  update: async (id: number, data: FormData) => {
    return await API.put(`/templates/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Delete a template by ID
  delete: async (id: number) => {
    return await API.delete(`/templates/${id}`);
  },

  // Update template status
  updateStatus: async (id: number, status: "Pending" | "Approved" | "Rejected") => {
    return await API.patch(`/templates/${id}/status`, { status });
  },

  // Get list of categories
  getCategories: async () => {
    return await API.get("/templates/categories/list");
  },
};
