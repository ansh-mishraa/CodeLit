import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_MODE === "development" ? "http://localhost:8080/api/v1" : import.meta.env.VITE_BACKEND_BASE_URL,
    withCredentials:true
})