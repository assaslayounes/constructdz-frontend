import axios from "axios";
//"http://localhost:5000/"
//https://injaz-backend.onrender.com
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://injaz-backend.onrender.com/",
  headers: { "Content-Type": "application/json" },
  timeout: 12000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("constructdz_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
