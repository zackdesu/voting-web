import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_LOCAL_API_URL
    : import.meta.env.VITE_API_URL;

export const api = axios.create({
  withCredentials: true,
  baseURL,
});
