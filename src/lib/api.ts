import axios from 'axios';
import { clearAdminToken, readAdminToken } from './session';

export const ApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

ApiClient.interceptors.request.use((config) => {
  const token = readAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

ApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isLoginRequest = requestUrl.includes('/api/auth/login');
    if (
      error.response?.status === 401 &&
      !isLoginRequest &&
      typeof window !== 'undefined' &&
      !window.location.pathname.includes('/admin/login')
    ) {
      clearAdminToken();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
