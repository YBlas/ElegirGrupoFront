import axios from "axios";

const api = axios.create({
  baseURL: 'https://elegir-grupo-api.vercel.app/',
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
