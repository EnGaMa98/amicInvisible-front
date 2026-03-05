import { api } from '../api';

const AssignmentsService = {
  list: (groupId) => {
    return api.get(`/groups/${groupId}/assignments`);
  },

  draw: (groupId) => {
    return api.post(`/groups/${groupId}/draw`);
  },

  sendEmails: (groupId, data = {}) => {
    return api.post(`/groups/${groupId}/send-emails`, data);
  },
};

export default AssignmentsService;
