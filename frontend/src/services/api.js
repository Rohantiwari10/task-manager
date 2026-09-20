import axios from "axios";

// Create one Axios instance for our backend
const api = axios.create({
  baseURL: "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT automatically to protected requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Send token as:
    // Authorization: Bearer <JWT>
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
