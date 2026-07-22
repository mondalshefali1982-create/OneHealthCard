import axios from 'axios';

// Create Axios Instance
// Since Vite proxies /api in local dev, and Vercel deploys both under the same domain,
// we can use /api as the base URL directly!
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if exists in local storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle token expiration (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // If we are in browser, we can force-redirect or let context handle it
      if (typeof window !== 'undefined') {
        // Only redirect if not already on auth/landing
        const path = window.location.pathname;
        if (path !== '/' && path !== '/auth') {
          window.location.href = '/auth';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
