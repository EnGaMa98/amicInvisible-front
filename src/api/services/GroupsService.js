import { api } from '../api';

const GroupsService = {
  list: (params = {}) => {
    return api.get('/groups', params);
  },

  get: (id, include = '') => {
    return api.get(`/groups/${id}`, include ? { include } : {});
  },

  save: (id, data) => {
    if (id) {
      return api.put(`/groups/${id}`, data);
    }
    return api.post('/groups', data);
  },

  remove: (id) => {
    return api.del(`/groups/${id}`);
  },

  duplicate: (id, data) => {
    return api.post(`/groups/${id}/duplicate`, data);
  },
};

export default GroupsService;
