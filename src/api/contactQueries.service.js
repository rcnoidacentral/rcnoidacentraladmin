// services/apiService.js
import axios from "axios";
import { API_CONFIG } from "../config/api.config";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

const apiService = {

  // ===================================
  // CONTACT QUERIES (ADMIN SIDE)
  // ===================================
  
  // Get all contact queries (Admin panel)
  getAllContactQueries: (params) => api.get("/api/contact", { params }),

  // Get single contact query by ID (Admin panel)
  getContactQueryById: (id) => api.get(`/api/contact/${id}`),

  // Update contact query status (Admin panel)
  updateContactQueryStatus: (id, data) =>
    api.patch(`/api/contact/${id}/status`, data),

  // Delete contact query (Admin panel)
  deleteContactQuery: (id) => api.delete(`/api/contact/${id}`),

  // Get contact query statistics (Admin panel)
  getContactQueryStats: () => api.get("/api/contact/stats"),

  // ===================================
  // CONTACT QUERIES (FRONTEND/USER SIDE)
  // ===================================
  
  // Submit contact query (Public - Frontend)
  submitContactQuery: (data) => api.post("/api/contact", data),

};

export default apiService;