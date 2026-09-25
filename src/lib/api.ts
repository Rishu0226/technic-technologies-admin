import axios from 'axios';

export const ApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle 401 Unauthorized globally
ApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Hit backend logout endpoint to clear HttpOnly cookie
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
        fetch('/api/session', { method: 'DELETE' }).finally(() => {
          window.location.href = '/admin/login';
        });
      }
    }
    return Promise.reject(error);
  }
);
