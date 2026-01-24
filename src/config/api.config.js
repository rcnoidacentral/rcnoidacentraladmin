export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_BACKEND_URL,

  ENDPOINTS: {
    SUBMIT_APPLICATION: "/api/applications",
    GET_APPLICATION: "/api/applications",
    GET_IMAGEKIT_AUTH: "/api/upload/imagekit-auth",
  },
};

export const IMAGEKIT_CONFIG = {
  PUBLIC_KEY: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  URL_ENDPOINT: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
};
