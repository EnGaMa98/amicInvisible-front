import { api } from '@/api/api';

const AuthService = {
  requestOtp: (email) => api.post('/auth/request-otp', { fields: { email } }),
  verifyOtp: (email, code) => api.post('/auth/verify-otp', { fields: { email, code } }),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
};

export default AuthService;
