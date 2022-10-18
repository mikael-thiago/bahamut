import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000",
});

api.interceptors.request.use(config => {
  if (!config.headers) return config;

  const token = localStorage.getItem("bahamut::user-token");

  if (!token) return config;

  if (!config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;

  return config;
});
