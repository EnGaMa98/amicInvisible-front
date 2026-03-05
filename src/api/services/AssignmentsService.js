import { api } from '../api';

const AssignmentsService = {
  list: (groupId) => {
    return api.get(`/groups/${groupId}/assignments`);
  },

  draw: (groupId) => {
    return api.post(`/groups/${groupId}/draw`);
  },

  sendEmails: (groupId) => {
    return api.post(`/groups/${groupId}/send-emails`);
  },
};

export default AssignmentsService;
