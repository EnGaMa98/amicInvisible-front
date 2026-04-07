import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

const PublicService = {
  getAssignment: (token) => instance.get(`/public/participant/${token}`).then((r) => r.data),
  updatePreferences: (token, preferences) => instance.put(`/public/participant/${token}/preferences`, { preferences }).then((r) => r.data),
};

export default PublicService;
