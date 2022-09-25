import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000",
});

api.interceptors.request.use((config) => {
  if (!config.headers) return config;

  if (!config.headers.Authorization)
    config.headers.Authorization = `Bearer ${localStorage.getItem("bahamut::user-token")}`;

  return config;
});
