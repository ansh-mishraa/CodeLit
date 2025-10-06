import axios from 'axios';

// Determine base URL based on standard Vite envs
const isDev = import.meta.env.DEV;
const devApiBase = import.meta.env.VITE_DEV_API_BASE_URL || 'http://localhost:8080/api/v1';
const prodApiBase = import.meta.env.VITE_BACKEND_BASE_URL;

export const axiosInstance = axios.create({
    baseURL: isDev ? devApiBase : prodApiBase,
    withCredentials: true,
});
