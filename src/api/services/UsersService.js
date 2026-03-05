import { api } from '@/api/api';

const UsersService = {
  list: (params = {}) => api.get('/users', params),
  save: (id, data) => (id ? api.put(`/users/${id}`, data) : api.post('/users', data)),
  remove: (id) => api.del(`/users/${id}`),
};

export default UsersService;
