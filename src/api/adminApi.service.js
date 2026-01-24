import axios from "axios";
import { API_CONFIG } from "../config/api.config";


const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

const apiService = {
  // Applications
  getAllApplications: () => api.get("/api/applications"),

  getApplicationById: (id) => api.get(`/api/applications/${id}`),

  updateApplicationStatus: (id, data) =>
    api.patch(`/api/applications/${id}/status`, data),

  bulkUpdateStatus: (data) => api.patch("/api/applications/bulk/status", data),

  deleteApplication: (id) => api.delete(`/api/applications/${id}`),

  attachOfferLetter: (id, data) =>
    api.patch(`/api/applications/${id}/offer-letter`, data),

  getImageKitAuth: () => api.get(`/api/upload/imagekit-auth`),
};

export default apiService;
