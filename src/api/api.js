import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle errors + 401
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
      return Promise.reject(new Error('Sessió expirada'));
    }
    const message = error.response?.data?.message || error.message || 'Error desconegut';
    return Promise.reject(new Error(message));
  }
);

export const api = {
  get: (url, params = {}) => instance.get(url, { params }).then((r) => r.data),
  post: (url, data = {}) => instance.post(url, data).then((r) => r.data),
  put: (url, data = {}) => instance.put(url, data).then((r) => r.data),
  del: (url) => instance.delete(url).then((r) => r.data),
};
